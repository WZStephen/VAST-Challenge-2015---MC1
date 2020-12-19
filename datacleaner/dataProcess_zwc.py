import pandas as pd
import numpy as np

def load_data(path):
    df = pd.read_csv(path)
    return df


def write_csv(df, path):
    df.to_csv(path, encoding='utf-8', index=False)


def drop(df):
    df = df.drop(df.columns[[0]], axis=1)
    df = df.drop(columns=['x-coor entrance', 'y-coor entrance'])
    df = df.rename(columns={'type_x': 'action_type'})
    return df


if __name__ == "__main__":
    df = load_data("data/Friday-Sunday-OnlyCheckIn.csv")
    # df = df[df['action_type'] != 'movement']
    times = pd.DatetimeIndex(df.Timestamp)
    grouped = df.groupby([times.day, times.hour, times.minute, "X", "Y"])
    df1 = grouped.groups
    t1 = grouped.size()
    # write_csv(df, "data/Friday-Sunday-OnlyCheckIn.csv")
    # write_csv(df, "data/Friday-Sunday-Weichi.csv")
