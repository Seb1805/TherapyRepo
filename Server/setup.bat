@echo off
REM Create a virtual environment called .venv
python -m venv .venv

REM Activate the virtual environment
call .venv\Scripts\activate.bat

REM Install requirements from requirements.txt
pip install -r requirements.txt

REM Run main.py using uvicorn
uvicorn main:app --reload