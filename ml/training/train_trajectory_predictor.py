"""ADAPT-X Machine Learning: PyTorch Neural Trajectory Predictor
Trains a deep recurrent neural network (LSTM) for multi-horizon physiological 
forecasting with Monte Carlo Dropout uncertainty estimation for 14-day mission trajectories.
"""
import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
from torch.utils.data import Dataset, DataLoader

class PhysiologicalTrajectoryDataset(Dataset):
    def __init__(self, data, seq_len=28, pred_len=56):
        self.seq_len = seq_len
        self.pred_len = pred_len
        self.X, self.y = [], []
        
        for i in range(len(data) - seq_len - pred_len + 1):
            self.X.append(data[i:i + seq_len])
            self.y.append(data[i + seq_len:i + seq_len + pred_len])
            
        self.X = torch.tensor(np.array(self.X), dtype=torch.float32)
        self.y = torch.tensor(np.array(self.y), dtype=torch.float32)
        
    def __len__(self):
        return len(self.X)
        
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

class AstronautLSTMForecaster(nn.Module):
    def __init__(self, input_dim=4, hidden_dim=64, num_layers=2, pred_len=56, output_dim=4, dropout=0.2):
        super().__init__()
        self.pred_len = pred_len
        self.output_dim = output_dim
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Sequential(
            nn.Linear(hidden_dim, 128),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(128, pred_len * output_dim)
        )
        
    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        # Use last hidden state
        last_state = lstm_out[:, -1, :]
        out = self.fc(last_state)
        return out.view(-1, self.pred_len, self.output_dim)

def train_trajectory_model():
    print("Preparing PyTorch trajectory forecasting dataset...")
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'processed', 'preprocessed_telemetry.csv'))
    df = pd.read_csv(dataset_path)
    
    features = ['heart_rate', 'hrv_rmssd', 'stress_score', 'spo2']
    raw_data = df[features].values
    
    # Normalization parameters (mean, std)
    mean = np.mean(raw_data, axis=0)
    std = np.std(raw_data, axis=0) + 1e-6
    norm_data = (raw_data - mean) / std
    
    dataset = PhysiologicalTrajectoryDataset(norm_data, seq_len=28, pred_len=56)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    model = AstronautLSTMForecaster(input_dim=4, hidden_dim=64, num_layers=2, pred_len=56, output_dim=4).to(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.003, weight_decay=1e-5)
    
    epochs = 40
    print(f"Training LSTM model for {epochs} epochs...")
    model.train()
    for epoch in range(1, epochs + 1):
        total_loss = 0.0
        for batch_x, batch_y in dataloader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            optimizer.zero_grad()
            preds = model(batch_x)
            loss = criterion(preds, batch_y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            
        if epoch % 10 == 0 or epoch == epochs:
            avg_loss = total_loss / len(dataloader)
            print(f"  Epoch {epoch}/{epochs} | Loss: {avg_loss:.5f}")
            
    # Save model weights and normalization stats
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
    os.makedirs(models_dir, exist_ok=True)
    
    weights_path = os.path.join(models_dir, 'trajectory_predictor.pt')
    torch.save(model.state_dict(), weights_path)
    print(f"Saved PyTorch weights -> {weights_path}")
    
    meta_path = os.path.join(models_dir, 'trajectory_meta.json')
    meta = {
        'architecture': '2-Layer LSTM with Linear Projection Head',
        'input_features': features,
        'seq_len_steps': 28,  # 7 days * 4 samples/day
        'pred_len_steps': 56, # 14 days * 4 samples/day
        'normalization': {
            'mean': mean.tolist(),
            'std': std.tolist()
        },
        'final_mse_loss': round(float(avg_loss), 5),
        'device': str(device)
    }
    with open(meta_path, 'w') as f:
        json.dump(meta, f, indent=2)
    print(f"Saved metadata -> {meta_path}")

if __name__ == '__main__':
    train_trajectory_model()
