import gurobipy as gp
import numpy as np
from traveler import LeadTraveler


class MIP(gp.Model):

    def __init__(self, name: str, lead_traveler: LeadTraveler):
        super().__init__(f'{name}|{lead_traveler}')

