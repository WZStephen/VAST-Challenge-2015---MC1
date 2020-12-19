import pandas as pd
import numpy as np
import time
start_time = time.time()


df = pd.read_csv('/Users/chen/Desktop/CSE578/project/data/Friday-Sunday-OnlyCheckIn.csv')

# df = df[df['actiont_type'] == 'check-in']

arrs = df['Park Guide Index'].unique()
a = ['Timestamp', 'id']
arr = np.array(arrs)

for i in arr:
    a.append(str(int(i)))

df1 = pd.DataFrame(columns=a)

df1['Timestamp'] = df['Timestamp']
df1['id'] = df['id']
df1 = df1.fillna(0)

for indexs, rows in df.iterrows():
    index = rows['Park Guide Index']
    s = str(int(index))
    df1.loc[indexs,s] = 1


df1['Timestamp'] = pd.to_datetime(df1['Timestamp'])
df1 = df1.set_index('Timestamp')
dfcount = df1.resample("T").sum()
dfcount = dfcount[dfcount['id'] != 0]

dfcount.to_csv('visitorsCountPerM.csv')

print('done\n')
print("--- %s seconds ---" % (time.time() - start_time))
