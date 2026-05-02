import csv
import os
from datetime import datetime, timedelta

csv_path = 'data/latest_jobs_fetched.csv'
if os.path.exists(csv_path):
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = list(csv.DictReader(f))
    
    if reader:
        base_time = datetime.now() - timedelta(hours=len(reader))
        # Ensure 'created_at' is in fieldnames
        fieldnames = list(reader[0].keys())
        if 'created_at' not in fieldnames:
            fieldnames.append('created_at')
            
        for i, row in enumerate(reader):
            # If created_at is missing or the default dummy date, update it
            if not row.get('created_at') or row['created_at'] == "2024-01-01 00:00:00":
                # We use i to keep them in the order they are currently in the file
                # If the file is newest at top, then i=0 is newest.
                # So we give i=0 the largest time.
                row['created_at'] = (datetime.now() - timedelta(minutes=i)).strftime('%Y-%m-%d %H:%M:%S')
        
        with open(csv_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(reader)
        print(f"Updated {len(reader)} jobs with timestamps.")
