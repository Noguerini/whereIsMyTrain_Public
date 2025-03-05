from flask import Flask, jsonify
from flask_cors import CORS
import geopandas as gpd
import time
import threading
import socket

app = Flask(__name__)
cors = CORS(app, origins='*')

geojson_file = r"frontEnd\src\ST04_ST47.geojson"

HOST = "127.0.0.1"
PORT = 5225

class Tracker:
    def __init__(self, filepath, scheduled_time=1.5):
        self.filepath = filepath
        self.gdf = None
        self.current_lat = None
        self.current_long = None
        self.scheduled_time = scheduled_time
        self.client_sockets = []
        self.lock = threading.Lock()

    def count_points_in_multilinestring(self):
        self.gdf = gpd.read_file(self.filepath)
        self.gdf = self.gdf.explode()
        point_counts = self.gdf.geometry.apply(lambda x: len(x.coords))
        self.total_points = point_counts.sum()
        self.time_interval = self.scheduled_time / self.total_points * 3600

    def track(self):
        for idx, row in self.gdf.iterrows():
            line = row["geometry"]
            for point in line.coords:
                self.current_lat, self.current_long = point
                self.send_position()
                time.sleep(self.time_interval)

    def start_tracking(self):
        self.count_points_in_multilinestring()
        tracking_thread = threading.Thread(target=self.track, daemon=True)
        tracking_thread.start()

    def send_position(self):
        data = f"{self.current_lat},{self.current_long}"
        with self.lock:
            for client in self.client_sockets:
                try:
                    client.sendall(data.encode("utf-8"))
                except:
                    self.client_sockets.remove(client)

    def add_client(self, client_socket):
        with self.lock:
            self.client_sockets.append(client_socket)

tracker = Tracker(geojson_file)
tracker.start_tracking()

def socket_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)
    print(f"Server listening on {HOST}:{PORT}")
    
    while True:
        client_socket, addr = server_socket.accept()
        print(f"Connection from {addr}")
        tracker.add_client(client_socket)

socket_thread = threading.Thread(target=socket_server, daemon=True)
socket_thread.start()
	
if __name__ == '__main__':
	app.run(debug=True, port=1220)