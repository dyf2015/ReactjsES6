import { DatePicker,Button,Icon,Input,Form,Row,Col,Tabs,Alert,message } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
//import Top from '../ComponentsV1/Top';
import {WeaTop} from 'weaCom';

function format(d,fmt) { //author: meizz 
    let o = {
        "M+": d.getMonth() + 1, //月份 
        "d+": d.getDate(), //日 
        "h+": d.getHours(), //小时 
        "m+": d.getMinutes(), //分 
        "s+": d.getSeconds(), //秒 
        "q+": Math.floor((d.getMonth() + 3) / 3), //季度 
        "S": d.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const Main = React.createClass({
	getInitialState() {
		return {
			datas:[],
			loading:false,
			date:"",
		};
	},
	componentDidMount() {
		const {ym} = this.props.location.query;
		ym && ym!="" && this.doGetData(ym);
	},
	getDatas(value) {
		const date = format(value,"yyyy-MM");
		this.doGetData(date);
	},
	doGetData(date) {
		let that = this;
		this.setState({
			date:date,
			loading:true,
		})
		$.ajax({
	        type:"POST",
	        url:"/cloudstore/app/no0000005/ControlServlet.jsp?action=Action_DoSalaryDatasGet&date="+date,
	        success(datas) {
	        	//console.log(datas);
	        	message.success("数据获取成功！");
	        	that.setState({
	        		datas:datas,
	        		loading:false,
	        	});
	        },
	        error(datas) {
	        	message.success("数据获取失败！");
	        	that.setState({
	        		loading:false,
	        	});
	        },
	        dataType: "json"
	    });
	},
	render() {
		//console.log("this.props:",this.props);
		//console.log("this.props.datas:",this.props.datas);
		const {ym} = this.props.location.query;
		let that = this;
		return <div style={{"padding-top":"10px","padding-left":"15px","padding-right":"15px",overflow:"auto","-webkit-overflow-scrolling": "touch"}}>
               <WeaTop title="工资单查询">
                    <MonthPicker defaultValue={ym} onChange={this.getDatas} />
               </WeaTop>
               {
	           	(this.state.datas).length>0&&this.state.date!=""?
               <div style={{"padding-top":"8px","text-align":"center"}}>
	           		<h1>工资[{this.state.date}]</h1>
					<Tabs tabPosition="top">
					{
						this.state.datas.map(function(data) {
							return <TabPane tab={data.type} key={data.id}><div>{that.getMobileDetail(data.names,data.values)}</div></TabPane>
						})
					}
			    	</Tabs>
               </div>
               :<Alert
			    message=""
			    description={this.state.date!=""?"对不起，当前日期["+this.state.date+"]暂无数据！":"请选择日期！"}
			    type="info"
			    showIcon />
               }
               </div>
              
	},
	getMobileDetail(names,values) {
		const nameArr = names.split(",");
		const valueArr = values.split(",");
		return (
			<table className="salary-table" width="100%">
				{
					nameArr.map((name,index)=>{
						if(valueArr[index] && parseFloat(valueArr[index])==0) {
							return (<tr></tr>)
						}
						return (
							<tr>
								<th width="50%">{name}</th>
								<td width="50%">{valueArr[index]}</td>
							</tr>
						)
					})
				}
			</table>
		)
	},
	getDetail(names,values) {
		const nameArr = names.split(",");
		const valueArr = values.split(",");
		//console.log(nameArr);
		let comArr1 = new Array();
		let comArr2 = new Array();
		let comArr3 = new Array();
		let comArr4 = new Array();
		for(let i=0;i<nameArr.length;i++) {
			const item = (
				<FormItem
				      label={nameArr[i]+"："}
				      labelCol={{ span: 12 }}
				      wrapperCol={{ span: 10 }}>
				      <Input defaultValue={valueArr[i]} disabled />
				</FormItem>
			)
			if(i%4==0) comArr1[comArr1.length] = item;
			if(i%4==1) comArr2[comArr2.length] = item;
			if(i%4==2) comArr3[comArr3.length] = item;
			if(i%4==3) comArr4[comArr4.length] = item;
		}
		//{comArr}
		return (
		<Form horizontal>
		<Row style={{"margin-top":"10px"}}>
			<Col span="6">
				{comArr1}
			</Col>
			<Col span="6">
				{comArr2}
			</Col>
			<Col span="6">
				{comArr3}
			</Col>
			<Col span="6">
				{comArr4}
			</Col>
		</Row>
		</Form>
		)
	}
});

export default Main