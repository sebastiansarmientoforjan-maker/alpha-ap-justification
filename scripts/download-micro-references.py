"""
Download AP Microeconomics Reference Materials
Downloads public AP released items from College Board to document diagnostic sources
"""

import requests
import os
from pathlib import Path
import time

# Base directories
BASE_DIR = Path(__file__).parent.parent / "diagnostics-references" / "microeconomics"
RELEASED_FRQS_DIR = BASE_DIR / "released-frqs"
SCORING_DIR = BASE_DIR / "scoring-guidelines"

# Create directories if they don't exist
RELEASED_FRQS_DIR.mkdir(parents=True, exist_ok=True)
SCORING_DIR.mkdir(parents=True, exist_ok=True)

# College Board public URLs (these are all legally available)
URLS = {
    "ced": "https://apcentral.collegeboard.org/media/pdf/ap-microeconomics-course-and-exam-description.pdf",
    "frqs": [
        # Years cited in diagnostic references
        "https://apcentral.collegeboard.org/media/pdf/ap23-frq-microeconomics.pdf",  # 2023 Micro #1, #3
        "https://apcentral.collegeboard.org/media/pdf/ap22-frq-microeconomics.pdf",  # 2022 Micro #1, #2
        "https://apcentral.collegeboard.org/media/pdf/ap21-frq-microeconomics.pdf",  # 2021 Micro #1, #2, #3
        "https://apcentral.collegeboard.org/media/pdf/ap20-frq-microeconomics.pdf",  # 2020 Micro #1, #3
        "https://apcentral.collegeboard.org/media/pdf/ap19-frq-microeconomics.pdf",  # 2019 Micro #1, #2, #3
        "https://apcentral.collegeboard.org/media/pdf/ap18-frq-microeconomics.pdf",  # 2018 Micro #2
    ],
    "scoring": [
        "https://apcentral.collegeboard.org/media/pdf/ap23-sg-microeconomics.pdf",
        "https://apcentral.collegeboard.org/media/pdf/ap22-sg-microeconomics.pdf",
        "https://apcentral.collegeboard.org/media/pdf/ap21-sg-microeconomics.pdf",
        "https://apcentral.collegeboard.org/media/pdf/ap19-sg-microeconomics.pdf",
    ]
}

def download_file(url, output_dir, filename):
    """Download a file from URL to output directory"""
    try:
        print(f"Downloading {filename}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        output_path = output_dir / filename
        with open(output_path, 'wb') as f:
            f.write(response.content)

        print(f"  Success: {filename}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"  Failed: {filename} - {e}")
        return False

def extract_year_from_url(url):
    """Extract year from College Board URL format"""
    # Format: "...ap23-frq-microeconomics.pdf" -> "23"
    filename = url.split('/')[-1]
    year = filename.split('-')[0][2:]  # "ap23" -> "23"
    return year

def main():
    print("=" * 60)
    print("AP MICROECONOMICS REFERENCE MATERIALS DOWNLOADER")
    print("=" * 60)
    print()

    # Download CED
    print("[1/3] Downloading Course & Exam Description...")
    download_file(URLS["ced"], BASE_DIR, "course-exam-description.pdf")
    time.sleep(1)

    # Download FRQs
    print("\n[2/3] Downloading Released FRQs...")
    for frq_url in URLS["frqs"]:
        year = extract_year_from_url(frq_url)
        filename = f"20{year}-frq-microeconomics.pdf"
        download_file(frq_url, RELEASED_FRQS_DIR, filename)
        time.sleep(1)

    # Download Scoring Guidelines
    print("\n[3/3] Downloading Scoring Guidelines...")
    for sg_url in URLS["scoring"]:
        year = extract_year_from_url(sg_url)
        filename = f"20{year}-sg-microeconomics.pdf"
        download_file(sg_url, SCORING_DIR, filename)
        time.sleep(1)

    print("\n" + "=" * 60)
    print("DOWNLOAD COMPLETE")
    print("=" * 60)
    print(f"\nFiles saved to: {BASE_DIR}")
    print()
    print("Legal Note:")
    print("All materials are publicly available from College Board")
    print("at apcentral.collegeboard.org for educational use.")

if __name__ == "__main__":
    main()
