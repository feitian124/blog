---
title: multispeack 简单研究
date: 2021-03-19 08:00:57
---

## multispeack 简单研究

MultiSpeak Specification 是一个广泛用于北美企业和公用事业部门(如水电)的企业应用互联规范，帮助它们定义接口， 让不同供应商的软件可以不需额外开发接口就可以互联。

为了达成这个目标， 该规范有3个主要部分组成：

- 通用数据模型  通用数据模型是对某一业务流程的数据的规范，如停电事件模型。通用数据模型使用 XML 描述。

- 消息结构 为了交换数据，需要定义消息结构，MultiSpeak 使用 WSDL 来描述消息， 用 web service 来交换消息， 支持实时的，或者批量。

- 业务流程 不同的 web service 调用组成了单个业务流程中的一个步骤，多个步骤组成了`一个业务流程`， 多个业务流程组成了`一个完整的业务`。
    `一个业务流程` 和 `一个完整的业务`分别在模块用户案例和完整用户案例中描述。

### 使用情况

- 超过 90 家企业和公用事业部门贡献和使用该规范， 有超过 [360 家经过训练的软件供应商](http://multispeak.wpengine.com/integrator-list-getting-help/)

- 需要注册会员， 不知道是否收费， 未注册尝试

- 下载规范文档需要收费， 按模块， 每个模块 300 美金， 页面上共 12 个收费模块， 3个免费模块, [详情](https://www.multispeak.com/guide-specifications/)

### 费用情况
未见开源产品， 它有一个官方市场， 有一些产品供购买，包括：

- End User Packages
有约 50 个模块，每个模块 500 美金

- Guide Specs
有约10多个收费模块，每个模块 300 美金， 3个免费模块

- Software Developer Packages
有约 50 个模块，每个模块 2500 美金

- Function Sets
有 3 个收费模块，每个 300 美金， 2个免费模块

- Specifications and other documents
1个收费， 1个免费

### 接口地图

接口分 v3, v4, v5, 下面主要列出 v5 的一些接口

#### Metering and Service Management
Connect/Disconnect CD
Meter Reading MR

#### Work Management
Resource Management RM
Scheduling & Assignment SA
Work Generator WG
Work Viewer WV
Work Requester (client only) WR
Work Performer WP
Work Owner WO

#### Work Order Accounting and Inventory
Assembly Management ASM
Finance & Accounting FA
Inventory Management INV
End Device Testing & Receiving EDTR

#### Customer Billing and PAN Management
Prepaid Metering PPM
Customer Billing CB
Commissioning & Provisioning CP
Payment Processing PP
Meter Data Management MDM
Payment Gateway PG

#### Outage Management & Distribution Operations
Call Handling CH
Outage Detection OD
Switching Orders SWO
Distribution Automation DA
Weather WEA
Outage Analysis OA
Location Tracking LT
SCADA SCADA

#### Demand Response
Demand Management DM
Distributed Energy Resources DER
Message Management (client Only) MM
Demand Response DR
PAN Communications PAN

#### Distribution Engineering, Planning & Construction
Enginering Analysis EA
Network Model Management MOD
Geographic Information System GIS
Field Design DGN
Underground Facility Locations LOC
Asset Management AM