## 线损模型

### 供入供出对象查询
- 查询供入
http://localhost:8080/archive/puao/loadItemDatas.action
aoId: 62548
eType: 1

- 查询供出
http://localhost:8080/archive/puao/loadItemDatas.action
aoId: 62548
eType: 2

使用以下 sql 查询， 然后在 java 中用 eType 过滤供入或供出:

select o.SN, o.AO_ID, o.AO_SUB_ID, o.DIRECTION, o.CALC_ATTR, o.E_TYPE, o.CALC_ELE, o.SORT_NO, o.UPDATE_TV, b.DESCRB as AO_SUB_ID_DESC 
from M_AO_ITEM o
inner join M_PU_AO b on o.AO_SUB_ID = b.AO_ID
<where>
<if test="aoId != null and aoId != ''">
and	o.AO_ID = #{aoId,jdbcType=DECIMAL}
</if>
<if test="measeId != null and measeId != ''">
and	o.AO_SUB_ID = #{measeId,jdbcType=DECIMAL}
</if>
</where>

## 线损分析

### 线损明细
http://localhost:8080/lineloss/analyze/detailList.do
tv: 1606838400
tvFmt: 2020-12-02
descrb: 母线平衡彭云测试1212
nodeId: 
leftNode: 
rightNode: 
code: 
supplyE: 71.16
saleE: 5.86
transferE: 
nonlossE: 
lossE1: 65.3
lossE2: 
lr1: 91.77
lr2: 
lr3: 
validity: 
tvUpdate: 
supplyIntegrity: 
saleIntegrity: 
accuLr1: 
accuLr2: 
accuLr3: 
abnormalMarked1: 
abnormalCause1: 
accuAbnormalMarked1: 
accuAbnormalCause1: 
esseTp: 521
esseId: 111
esseName: SE_DM
aoId: 62548
period: 2
periodDesc: 日
name: 母线平衡彭云测试1212
dataTime: 1606838400