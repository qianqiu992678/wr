必填属性：
alert('{"compil_info":"1","compil_version":"0.1","widget_type":""}')

compil_info:1:编译
compil_versiion:0.1:编译版本
widget_type:组件名_本名


文字组件(根据地址绑定数值):
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"aiText","signalType":"yaoceObj","address":"3"}')//内容在前数据在后 比如:功率因数为2

文字组件(根据地址绑定数值):
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"textAi","signalType":"yaoceObj","address":"3"}')//数据在前内容在后 比如:5V

文字组件(根据遥信值决定显示'正常'/'异常')
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"normalUnnormalWIDGET","address":"3"}')

温度计组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"tempText"}')

普通组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"widget"}');

开关:(outputSwitch)
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"switch_connector","address":"3","ng-show":"newCurrentData.yaoxinObj[3].value==0"}')

跳转组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"linkBtn","ng-click":"getSvg('svg/1/中心口.svg')"}')

指示灯(点击变色):
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"lampA","address":"3","signalType":"yaoxinObj"}');

点击显示/隐藏组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"showcontrollor"}')
普通组件会将alert里面的属性放到该标签上，可以给组件任意起名字（但是不能重复已有的名字）。
文字组件分两种，内容在数据之前和内容在数据之后两种，组件名分别为aiText 比如:功率因数为2 和textAi比如:5V。
温度计组件名为tempText。需要定义地址address、上限值dz2和下限值dz1



温度计说明和使用:需要定义地址address、上限值dz2和下限值dz1
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"tempText"}')  //刻度尺数值比如0,10,20...
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"widget","class":"currentTemp"}')   //当前的温度的容器
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"widget","class":"tempBox"}')   //温度容器
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"widget","Address":"5","dz2":"75","dz1":"25"}')//整个温度计  需要地址、定值1和定值2,定值1代表低于该值是橙色，定值2代表高于该值为红色，在定值1和定值2之间为绿色，不填定值1和定值2都为绿色
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"textAi","signalType":"yaoceObj","address":"5"}') //显示当前温度为多少
