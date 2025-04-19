from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# MySQL connection URL (adjust if you set a password)
DATABASE_URL = "mysql+pymysql://root:@localhost/task_manager"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Define your Task table
class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    date = Column(String(50))  # e.g. "Monday", "Tuesday", etc.

# Create the table(s) in the database
Base.metadata.create_all(bind=engine)
