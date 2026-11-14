"""ADAPT-X Machine Learning: Adaptive Response Index (ARI) Training Pipeline
Trains an XGBoost multi-output regressor and classification model to predict 
astronaut adaptation index across 5 physiological dimensions:
- Cardiovascular
- Musculoskeletal
- Circadian
- Metabolic
- Behavioural
"""
import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb

def load_data():
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'processed', 'preprocessed_telemetry.csv'))
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")
    df = pd.read_csv(dataset_path)
    return df

def feature_engineering(df):
    # Rolling window temporal features
    df['hr_rolling_mean'] = df['heart_rate'].rolling(window=4, min_periods=1).mean()
    df['hrv_rolling_mean'] = df['hrv_rmssd'].rolling(window=4, min_periods=1).mean()
    df['stress_rolling_mean'] = df['stress_score'].rolling(window=4, min_periods=1).mean()
    df['activity_rolling_mean'] = df['activity_steps'].rolling(window=4, min_periods=1).mean()
    
    # Pulse pressure
    df['pulse_pressure'] = df['bp_systolic'] - df['bp_diastolic']
    # Mean arterial pressure (MAP)
    df['map'] = df['bp_diastolic'] + (df['pulse_pressure'] / 3.0)
    
    feature_cols = [
        'heart_rate', 'hrv_rmssd', 'bp_systolic', 'bp_diastolic', 'spo2',
        'core_temperature', 'glucose', 'sleep_duration', 'activity_steps',
        'stress_score', 'hr_rolling_mean', 'hrv_rolling_mean', 'stress_rolling_mean',
        'activity_rolling_mean', 'pulse_pressure', 'map'
    ]
    
    # Target: 5 Subsystem Scores + Overall ARI
    targets = pd.DataFrame({
        'cardiovascular': np.clip(100 - (df['heart_rate'] - 65) * 1.2 - (52 - df['hrv_rmssd']) * 1.5, 30, 100),
        'musculoskeletal': np.clip(100 - (df['mission_day'] * 0.22) + (df['activity_steps'] - 9000) * 0.003, 30, 100),
        'circadian': np.clip(70 + (df['sleep_duration'] - 7.0) * 12.0 - np.abs(df['core_temperature'] - 36.8) * 15.0, 30, 100),
        'metabolic': np.clip(95 - (df['glucose'] - 90) * 0.8, 40, 100),
        'behavioural': np.clip(100 - df['stress_score'] * 0.9, 20, 100),
        'overall_ari': df['ari_score']
    })
    
    return df[feature_cols], targets, feature_cols

def train():
    print("Loading telemetry data...")
    df = load_data()
    X, y, feature_names = feature_engineering(df)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {}
    metrics = {}
    
    for col in y.columns:
        print(f"Training XGBoost Regressor for: {col}...")
        model = xgb.XGBRegressor(
            n_estimators=120,
            learning_rate=0.06,
            max_depth=4,
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=42
        )
        model.fit(X_train, y_train[col])
        preds = model.predict(X_test)
        
        mse = mean_squared_error(y_test[col], preds)
        mae = mean_absolute_error(y_test[col], preds)
        r2 = r2_score(y_test[col], preds)
        
        models[col] = model
        metrics[col] = {
            'rmse': round(float(np.sqrt(mse)), 3),
            'mae': round(float(mae), 3),
            'r2_score': round(float(r2), 3),
        }
        print(f"  -> {col}: R²={r2:.3f}, MAE={mae:.3f}, RMSE={np.sqrt(mse):.3f}")
    
    # Save models
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
    os.makedirs(models_dir, exist_ok=True)
    
    model_file = os.path.join(models_dir, 'adaptation_models.joblib')
    joblib.dump(models, model_file)
    print(f"Saved trained models -> {model_file}")
    
    # Feature importance of overall ARI
    ari_model = models['overall_ari']
    importances = dict(zip(feature_names, [round(float(v), 4) for v in ari_model.feature_importances_]))
    sorted_importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))
    
    metadata = {
        'model_type': 'XGBoost Multi-Target Adaptive Response Index Model',
        'metrics': metrics,
        'feature_names': feature_names,
        'feature_importances_overall_ari': sorted_importances,
        'trained_at': pd.Timestamp.now().isoformat()
    }
    
    meta_file = os.path.join(models_dir, 'adaptation_meta.json')
    with open(meta_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata -> {meta_file}")

if __name__ == '__main__':
    train()
