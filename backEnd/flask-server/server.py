# Import flask and datetime module for showing date and time
from flask import Flask, jsonify
from flask_cors import CORS
import geopandas as gpd
import time
import threading




# Initializing flask app
app = Flask(__name__)
cors = CORS(app, origins='*')


geojson_file = r"C:\Users\nogue\Desktop\UPM\Optativas\PGAA\QGIS\ST04_ST47.geojson"


class Tracker:
    def __init__(self, filepath, scheduled_time=1.5):
        self.filepath = filepath
        self.gdf = None
        self.current_lat = None
        self.current_long = None
        self.scheduled_time = scheduled_time
        self.thread = None

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
                time.sleep(self.time_interval)

    def start_tracking(self):
        self.count_points_in_multilinestring()
        self.thread = threading.Thread(target=self.track)
        self.thread.start()

    def get_latest_coordinates(self):
        return self.current_lat, self.current_long

    def stop_tracking(self):
        if self.thread:
            self.thread.join()  # Wait for the tracking thread to finish


tracker = Tracker(geojson_file)
tracker.start_tracking()  # Start tracking in a separate thread



@app.route("/api/users", methods=["GET"])
def get_current_position():
    current_lat, current_long = tracker.get_latest_coordinates()
    return jsonify(train_position=[current_lat, current_long])


	
# Running app
if __name__ == '__main__':
	app.run(debug=True, port=1220)
