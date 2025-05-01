from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

Base = declarative_base()
engine = create_engine("mysql+pymysql://root:@localhost/task_manager")  # Replace with your database URL
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Task(Base):
    __tablename__ = 'tasks1'

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    parent_task_id = Column(Integer, ForeignKey('tasks1.id'), nullable=True)
    task_name = Column(Text, nullable=False)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)