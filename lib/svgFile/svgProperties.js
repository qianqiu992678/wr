//必填属性：
alert('{"compil_info":"1","compil_version":"0.1","widget_type":""}')

//compil_info:1:编译
//compil_versiion:0.1:编译版本
//widget_type:组件名_本名


//文字组件(根据地址绑定数值):
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"aiText","signalType":"yaoceObj","address":"3"}')//内容在前数据在后 比如:功率因数为2

//文字组件(根据地址绑定数值):
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"textAi","signalType":"yaoceObj","address":"3"}')//数据在前内容在后 比如:5V

//遥信值显示组件numberValue
/**valueDisplay
 * unit:单位，默认  无
 * afterunit:单位是否在后边 1：后边，0:前边  默认在后边
 * valuelength:位数，   整数部分位数，小数部分位数    默认3，2
 * address:地址  
 * signalType:yaoceObj/yaoxinObj/yaomaiObj  默认yaoceObj
 * */
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"numberValue","address":"3","signalType":"yaoceObj","unit":"kw","afterunit":"1","valuelength":"3"}');
/**数码管字体组件
 * address:地址
 * leng:整数位数，小数位数
 * signalType:yaoceobj
 * color:颜色  默认红色
 * */
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"specialFont","address":"3","leng":"3,2","signalType":"yaoceObj","color":"green"}');
//温度计组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"tempText"}')

//普通组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"widget"}');

//开关:(outputSwitch)
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"switch_connector","address":"3","ng-show":"newCurrentData.yaoxinObj[3].value==0"}')

//开关b:(switchBWIDGET)
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"switchB","address":"3"}')

//跳转组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"linkBtn","ng-click":"getSvg('svg/1/中心口.svg')"}')

//柱状图组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"histogram","col":"3","row":"4","arrData":"objArr"}')

//折线图组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"linechart","arrData":"objArr"}')

//添加方法的按钮组件:
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"functionBtn","ng-click":"fun()"}')

//普通组件会将alert里面的属性放到该标签上，可以给组件任意起名字（但是不能重复已有的名字）。
//文字组件分两种，内容在数据之前和内容在数据之后两种，组件名分别为aiText 比如:功率因数为2 和textAi比如:5V。
//温度计组件名为tempText。需要定义地址address、上限值dz2和下限值dz1

//温度计说明和使用:需要定义地址address、上限值dz2和下限值dz1
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"tempText"}')  //刻度尺数值比如0,10,20...
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"widget","class":"currentTemp"}')   //当前的温度的容器
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"widget","class":"tempBox"}')   //温度容器
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"widget","Address":"5","dz2":"75","dz1":"25"}')//整个温度计  需要地址、定值1和定值2,定值1代表低于该值是橙色，定值2代表高于该值为红色，在定值1和定值2之间为绿色，不填定值1和定值2都为绿色
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"textAi","signalType":"yaoceObj","address":"5"}') //显示当前温度为多少


//管道组件    opposite方向变换0:默认左->右 上->下 1:右->左  下->上    pipedirect:horizontal->横向  longitudinal->纵向   (该组件不可以旋转)  lineColor->管壁线条颜色    fillColor->填充块颜色
alert('{"compil_info":"1","compil_version":"0.1","address":"3","signalType":"yaoceObj","widget_type":"pipeWIDGET","opposite":"0","pipedirect":"horizontal","lineColor":"red","fillColor":"yellow"}')
//新管道组件
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"newPipe","signalType":"yaoceObj","address":"3","opposite":"0","pipedirect":"horizontal","lineColor":"red","fillColor":"yellow"}')
//门打开状态组件   地址对应值为1时显示
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"opendoor","address":3}')
//门关闭状态组件   地址对应值为0时显示
alert('{"compil_info":"1","compil_version":"0.1","widget_type":"closedoor","address":3}')
//遥信值显示组件valueText
alert('{"compil_info":"1","compil_version":"0.1","widget_type":""}')