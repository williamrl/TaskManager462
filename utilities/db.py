from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

Base = declarative_base()
engine = create_engine("mysql+pymysql://root:@localhost/task_manager")  # Replace with your database URL
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    date = Column(String(50))
    parent_id = Column(Integer, ForeignKey('tasks.id'), nullable=True)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)