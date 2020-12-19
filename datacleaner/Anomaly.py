import pandas as pd
from collections import Counter


# Change me
df = pd.read_csv(r'/Users/chen/Desktop/CSE578/VAST-2015-MC1-Bohan/datacleaner/data/Friday-Sunday-OnlyCheckIn.csv')


df = df[df['action_type'] == 'check-in']
df.loc[df['Real World Type'] == 'Long Coaster', 'type_y'] = "Fast&Furious"
df.loc[df['Real World Type'] == 'Metal Coaster', 'type_y'] = "Fast&Furious"
df.loc[df['Real World Type'] == 'Wooden Coaster', 'type_y'] = "Fast&Furious"
df.loc[df['Real World Type'] == 'Wild Mouse', 'type_y'] = "Fast&Furious"
df.loc[df['Real World Type'] == 'Up and Back Coaster', 'type_y'] = "Fast&Furious"       # 速度与激情
df.loc[df['Real World Type'] == 'SkyDiver', 'type_y'] = "Anti-gravity"
df.loc[df['Real World Type'] == 'Centrifuge', 'type_y'] = "Anti-gravity"
df.loc[df['Real World Type'] == 'Fireball', 'type_y'] = "Anti-gravity"
df.loc[df['Real World Type'] == 'Ali Baba', 'type_y'] = "Anti-gravity"                      # 反重力



df.loc[df['type_y'] == 'Everybody', 'type_y'] = "Regular"       # 常规组
df.loc[df['type_y'] == 'Kiddie', 'type_y'] = "Family"           # 家庭组
df.loc[df['type_y'] == 'Entrance', 'type_y'] = "Chilling"       # 闲逛
df.loc[df['type_y'] == 'Pavilion', 'type_y'] = "Senior_group"   # 老年组
df.loc[df['type_y'] == 'Show Hall', 'type_y'] = "Show"           #



# merge each check in for same user
df_merge = df['type_y'].groupby(df['id']).apply(lambda x:[','.join(x)])
df_merge = df_merge.reset_index()
aaa = df['Real World Type'].groupby(df['id']).apply(lambda x:[','.join(x)])
aaa = aaa.reset_index()
df_merge['Real World Type'] = aaa['Real World Type']
del aaa

# get user check in path
tmp = []
tmp2 = []
for row in df_merge.iterrows():
    count1, count2 = Counter(),Counter()
    count1.update(word.strip('[].,?!"\'') for word in str(row[1]['type_y']).split(','))
    count2.update(word.strip('[].,?!"\'') for word in str(row[1]['Real World Type']).split(','))
    tmp.append(count1.most_common(3))
    tmp2.append(count2.most_common(10))
df_merge['type'] = tmp

# tmp2 save for future merge (Line 105)
# df_merge['Real World Type'] = tmp2
del tmp, count1, count2

tmp = []
for item in df_merge['type']:
    item = str(item).replace('[', '')
    item = str(item).replace(']', '')
    item = str(item).replace('(', '')
    item = str(item).replace(')', '')
    item = str(item).replace('\'', '')
    item = str(item).replace(',', '')
    tmp.append(item)

# most preference type for each user
df_merge['most_type'] = tmp
tmp = df_merge['most_type'].str.split(' ', expand=True)
df_merge['most_type'] = tmp[0]
info_MostType = df_merge['most_type'].value_counts().to_frame()
info_MostType.head(7)
del tmp


cols = ['id','most_type','type','type_y','Real World Type']
df_merge = df_merge[cols]

tmp = tmp3 = []
FF = Counter()
Re = Counter()
Ag = Counter()
Fa = Counter()
Ci = Counter()
Sg = Counter()
S = Counter()
for row in df_merge.iterrows():
    row[1]['Real World Type']
    count = Counter()
    count.update(word.strip('[].,?!"\'') for word in str(row[1]['Real World Type']).split(','))

    if row[1]['most_type'] == 'Fast&Furious':
        FF = FF + count
    elif row[1]['most_type'] == 'Regular':
        Re = Re + count
    elif row[1]['most_type'] == 'Anti-gravity':
        Ag = Ag + count
    elif row[1]['most_type'] == 'Family':
        Fa = Fa + count
    elif row[1]['most_type'] == 'Chilling':
        Ci = Ci + count
    elif row[1]['most_type'] == 'Senior_group':
        Sg = Sg + count
    elif row[1]['most_type'] == 'Show':
        S = S + count

    tmp.append(count.most_common(10))

tmp3 = [FF.most_common(10),
        Re.most_common(10),
        Ag.most_common(10),
        Fa.most_common(10),
        Ci.most_common(10),
        Sg.most_common(10),
        S.most_common(10)]

df_merge['Real World Type'] = tmp2
info_MostType['Top10'] = tmp3

# get Top 10 visualize data
tmp=[]
for item in info_MostType['Top10']:
    item = str(item).replace('[', '')
    item = str(item).replace(']', '')
    item = str(item).replace('(', '')
    item = str(item).replace(')', '')
    item = str(item).replace('\'', '')
    # item = str(item).replace(',', '')
    tmp.append(item)

info_MostType['detail'] = tmp
Top10Detail = info_MostType['detail'].str.split(',', expand=True)

del tmp, tmp2, tmp3, FF, Re, Ag, Fa, Ci, Sg, S, count


# --------------------- anomaly ---------------------------

# get anomaly from entrance group
anomaly_entrance = df_merge.loc[df_merge['most_type'] == 'Chilling']
tmp = []
for sentence in anomaly_entrance['type_y']:
        counts = Counter()
        counts.update(word.strip('[].,?!"\'') for word in str(sentence).split(','))
        if len(counts) < 3:
            tmp.append('Anomaly')
        else:
            tmp.append(counts.most_common(3))
anomaly_entrance['type'] = tmp
info_Anomaly_Entrance = anomaly_entrance['type'].value_counts()
del tmp


# get anomaly from Coaster group
anomaly_coaster = df_merge.loc[df_merge['most_type'] == 'Fast&Furious']
tmp = []
for sentence in anomaly_coaster['type_y']:
    counts = Counter()
    counts.update(word.strip('[].,?!"\'') for word in str(sentence).split(','))
    if len(counts) < 3:
        tmp.append('Anomaly')
    else:
        tmp.append(counts.most_common(3))
anomaly_coaster['type'] = tmp
info_Anomaly_Coaster = anomaly_coaster['type'].value_counts()
del tmp


# get anomaly from Everybody group
anomaly_everybody = df_merge.loc[df_merge['most_type'] == 'Regular']
tmp = []
for sentence in anomaly_everybody['type_y']:
    counts = Counter()
    counts.update(word.strip('[].,?!"\'') for word in str(sentence).split(','))
    if len(counts) < 3:
        tmp.append('Anomaly')
    else:
        tmp.append(counts.most_common(3))
anomaly_everybody['type'] = tmp
info_Anomaly_Everybody = anomaly_everybody['type'].value_counts()
del tmp


# get anomaly from kiddie group
anomaly_kiddie = df_merge.loc[df_merge['most_type'] == 'Family']
tmp = []
for sentence in anomaly_kiddie['type_y']:
    counts = Counter()
    counts.update(word.strip('[].,?!"\'') for word in str(sentence).split(','))
    if len(counts) < 3:
        tmp.append('Anomaly')
    else:
        tmp.append(counts.most_common(3))
anomaly_kiddie['type'] = tmp
info_Anomaly_Kiddie = anomaly_kiddie['type'].value_counts()
del tmp


def getGroupAnomaly(df):
    tmp = []
    for sentence in df['type_y']:
        counts = Counter()
        counts.update(word.strip('[].,?!"\'') for word in str(sentence).split(','))
        if len(counts) < 3:
            tmp.append('Anomaly')
        else:
            tmp.append(counts.most_common(3))
    df['type'] = tmp
    del tmp
    return df


# get anomaly from kiddie group
anomaly_AG = df_merge.loc[df_merge['most_type'] == 'Anti-gravity']
anomaly_AG = getGroupAnomaly(anomaly_AG)
info_Anomaly_AG = anomaly_AG['type'].value_counts()

anomaly1 = anomaly_entrance[anomaly_entrance['type'] == 'Anomaly']
anomaly2 = anomaly_coaster[anomaly_coaster['type'] == 'Anomaly']
anomaly3 = anomaly_everybody[anomaly_everybody['type'] == 'Anomaly']
anomaly4 = anomaly_kiddie[anomaly_kiddie['type'] == 'Anomaly']
anomaly5 = anomaly_AG[anomaly_AG['type'] == 'Anomaly']

anomaly = pd.concat([anomaly1, anomaly2, anomaly3, anomaly4, anomaly5])


chillingGroup = df_merge[df_merge['most_type'] == 'Chilling']
countInfo_Chilling = chillingGroup['Real World Type'].value_counts()


showGroup = df_merge[df_merge['most_type'] == 'Show']
countInfo_Show = showGroup['Real World Type'].value_counts()


# info_MostType.to_csv('/Users/chen/Desktop/CSE578/VAST-2015-MC1-Bohan/datacleaner/data/Top10.csv')