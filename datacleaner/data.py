import pandas as pd
from collections import Counter
import numpy as np
#
# df1= pd.read_csv(r'./data/park-movement-Fri-FIXED-2.0.csv')
# df2= pd.read_csv(r'./data/park-movement-Sat.csv')
# df3= pd.read_csv(r'./data/park-movement-Sun.csv')
# df4= pd.read_csv(r'./data/Ride Details.xlsx - Sheet1.csv')
#
# df5 = df1.append([df2,df3],ignore_index=True)
# df5 = df5.drop([26021962])
#
# dftest = df5
#
# df4['xy'] = df4['x-coor entrance'].astype(str) + df4['y-coor entrance'].astype(str)
# dftest['xy'] = dftest.X.astype(str) + dftest.Y.astype(str)
#
#
# dftest = pd.merge(dftest,df4,how='left',on='xy')
#
#
# dftest.to_csv('./XyWithType.csv')


df = pd.read_csv(r'./XyWithTypeNoNull.csv')
df = df[df['type_x'] == 'check-in']
# a = df['id'].unique()
df_merge = df['type_y'].groupby(df['id']).apply(lambda x:[','.join(x)])
df_merge = df_merge.reset_index()
df_merge['type_y'] = df_merge['type_y'].replace('[',']')
test = []
#
# for i in df_merge['type_y']:
#     i = str(i).replace('[','')
#     i = str(i).replace(']','')
#     test.append(i.split(','))
# df_merge['type'] = test
#
# for i in df_merge['type_y'][0:2]:
#     for elem in i:
#         print(elem)

# counts = Counter()
#
#
# for sentence in df_merge['type_y']:
#     counts.update(word.strip('.,?!"\'').lower() for word in sentence.split(','))
# print(counts.most_common(1)[0])
# #
df_merge['type_y'] = df_merge['type_y'].apply(lambda x: [i for i in x])

test = []
# counts = Counter()

for sentence in df_merge['type_y']:
        counts = Counter()
        counts.update(word.strip('[].,?!"\'').lower() for word in str(sentence).split(','))
        test.append(counts.most_common(3))
df_merge['type'] = test

test2 = []
for item in df_merge['type']:
    item = str(item).replace('[', '')
    item = str(item).replace(']', '')
    item = str(item).replace('(', '')
    item = str(item).replace(')', '')
    item = str(item).replace('\'', '')
    item = str(item).replace(',', '')
    test2.append(item)

df_merge['most_type'] = test2
test2 = df_merge['most_type'].str.split(' ',expand = True)
df_merge['most_type'] = test2[0]
# print(counts.most_common(1)[0])
print(df_merge['most_type'].unique())

sum = df_merge['most_type'].value_counts()


# print(len(test.groups.keys()))


