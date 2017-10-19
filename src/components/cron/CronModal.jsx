/**
 * Created by 叶子 on 2017/7/31.
 */
import React, { PropTypes } from 'react';
import _ from 'lodash';
import 'whatwg-fetch';
import { Modal, Tabs, Radio, Checkbox, InputNumber, Form, Button } from 'antd'

class CronModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'second',
            cron: {
                second: 1,
                minute: 1,
                hour: 1,
                day: 1,
                montn: 1,
                week: 1,
                year: 1
            },
        }
    }

    // /*生命周期函数--->该方法在完成首次渲染之前被调用*/
    // componentWillMount() {
    //     /* 设置推荐时段的状态*/
    //     this.setState({
    //     });
    // }
    // /*首次使用组建类时,组件已经被渲染，DOM操作请放在这*/
    // componentDidMount() {
    // }
    // /*存在期：随着应用状态的改变，以及组件逐渐受到影响，你将会看到下面的方法一次被调用：*/
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps);
    // }
    //
    // /**
    //  *条件：当组件确定要更新，在 render 之前调用
    //  *用处：这个时候可以确定一定会更新组件，可以执行更新前的操作
    //  *注意：方法中不能使用 setState ，setState 的操作应该在 componentWillReceiveProps 方法中调用
    //  * @param nextProps
    //  * @param nextState
    //  */
    // componentWillUpdate(nextProps, nextState) {
    // }
    //
    // /**
    //  * 组件已经被更新后的方法
    //  * @param nextProps
    //  * @param nextState
    //  */
    // componentDidUpdate(nextProps, nextState) {
    // }

    render() {
        const TabPane = Tabs.TabPane,
            RadioGroup = Radio.Group,
            radioStyle = {
                display: 'block',
                height: '40px',
                lineHeight: '30px',
            },
            FormItem = Form.Item,
            { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form,// 表单对用的处理
            //根据传入的页签不同得到cron的组成明细
            getCronDetail = () => {
                const form = this.props.form;
                let crons = [];
                _.forEach(this.state.cron, function(n, key) {
                    let cronDetail = "";
                    if(n === 1){
                        cronDetail = '*'
                    }else if(n === 2){//周期
                        let start = form.getFieldValue(key+'_start'),
                            end = form.getFieldValue(key+'_end');
                        cronDetail = start+'-'+end;
                    }else if(n === 3){// 从**开始多久执行一次
                        let point = form.getFieldValue(key+'_point'),
                            step = form.getFieldValue(key+'_step');
                        cronDetail = point+'/'+step;
                    }else if(n === 4){// 指定
                        let specifys = form.getFieldValue(key+'_specify')
                        let specify = ""
                        if(specifys !== undefined){
                            specify = specifys.join(",");
                        }
                        cronDetail = specify;
                    }else if(n === 5){//不指定
                        if(key !== 'year'){
                            cronDetail = '?';
                        }
                    }else if(n === 6){// 每月的最后一天
                        cronDetail = "L";
                    }else if(n === 7){// 每月的*号最近的那个工作日
                        let time = form.getFieldValue(key+'_time')+'W';
                    }else if(n === 8){// 第几个周的星期几
                        let point = form.getFieldValue(key+'_point'),
                            step = form.getFieldValue(key+'_step');
                        cronDetail = point+'#'+step;
                    }else if(n === 9){// 本月最后一个星期几
                        let time = form.getFieldValue(key+'_time')+'L';
                    }else if(n === 10){//

                    }
                    crons.push(cronDetail);
                });
                return crons;
            },
            toolBarAction = {
            // 确认按钮
                onOk : () =>{
                    let cron = getCronDetail().join(' ');
                    this.props.onOk(cron)
                },
                // 列出最近运行时间
                listRunTime: () => {
                    let cron = getCronDetail().join(' ');
                    let url = 'http://cron.qqe2.com/CalcRunTime.ashx?CronExpression=0';//+cron
                    console.error('列出数据最近运行时间：',url)
                    // fetch(url).then(response => response.json())
                    //     .then(data => console.error(data))
                    //     .catch(e => console.error("Oops, error", e))
                    // fetch(url, {
                    //     credentials: 'include',
                    //     headers: { 'Accept': 'application/json, text/plain, */*' }
                    // }).then(res => {
                    //     return res.json()
                    // }).then(json => {
                    //     console.error('测试结果',json)
                    // })
                    let postData = {cityCode: '01010101'};
                    fetch('http://www.zuimeitianqi.com/zuimei/queryWeather', {
                        method: 'POST',
                        mode: 'cors',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: JSON.stringify(postData)
                    }).then(function(response) {
                        console.err('来吧，测试结果：', response);
                    });
                    Modal.success({
                        title: `表达式(${cron})最近五次运行时间`,
                        content: cron,
                    });
                },
                // 列出radio
                listRadios: (opts,type) => {
                    var res = [],size = 0;
                    for(var i = 0; i < opts; i++) {
                        let number = i;
                        if(type ==='day' || type === 'month'|| type === 'week'){
                            number++;
                        }
                        let id = number+'';
                        if(number < 10){
                            id = '0'+number;
                        }
                        size++;
                        res.push(<Checkbox value={number}>{id}</Checkbox>)
                        if(size >= 10){
                            res.push(<br/>)
                            size = 0;
                        }
                    }
                    return res
                },
                //切换tab
                onChangeTabs: (key) =>{
                    console.error('目前活跃的面板是：',key)
                    this.setState({
                        activeKey: key
                    });
                },
                // 切换时分秒日月年
                onChange: (e) =>{
                    let value = e.target.value,
                        activeKey = this.state.activeKey;
                    let prop = this.state;
                    console.error('目前活跃的radio是：',value)
                    prop.cron[activeKey] = value;
                    this.setState(prop);
                },
            },
            cronModalOpts = {
                title: 'ETL定时设置',
                visible: this.props.visible,
                width: 580,
                style: {width: 580, height: 500, top: 100},
                onCancel: this.props.onCancel,
                onOk: toolBarAction.onOk,
                footer: [
                    <Button style={{float: 'left'}} onClick={toolBarAction.listRunTime}>最近五次运行时间</Button>,
                    <Button onClick={this.props.onCancel}>取消</Button>,
                    <Button onClick={toolBarAction.onOk}>确定</Button>,
                ]
            }

        return (
            <div>
                <Modal {...cronModalOpts}>
                    <Tabs defaultActiveKey="second" onChange={toolBarAction.onChangeTabs}>
                        <TabPane tab="秒" key="second">
                            <RadioGroup name="secondGroup" defaultValue={1} onChange={toolBarAction.onChange}>
                                <Radio style={radioStyle} value={1}>每秒 允许的通配符[, - * /]</Radio>
                                <Radio style={radioStyle} value={2}>
                                    <tr>
                                        <Form layout="inline">
                                            周期从
                                            <FormItem>
                                                {getFieldDecorator('second_start',{
                                                    initialValue: 0
                                                })(
                                                    <InputNumber size="small" min={0} max={59} />
                                                )}
                                            </FormItem>
                                            -
                                            <FormItem>
                                                {getFieldDecorator('second_end',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={0} max={59} />
                                                )}
                                            </FormItem>
                                            秒
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={3}>
                                    <tr>
                                        <Form layout="inline">
                                            从
                                            <FormItem>
                                                {getFieldDecorator('second_point',{
                                                    initialValue: 0
                                                })(
                                                    <InputNumber size="small" min={0} max={59} />
                                                )}
                                            </FormItem>
                                            秒开始,每
                                            <FormItem>
                                                {getFieldDecorator('second_step',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={59} />
                                                )}
                                            </FormItem>
                                            秒执行一次
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={4}>
                                    指定<br/>
                                    <Form layout="inline">
                                        <FormItem>
                                            {getFieldDecorator('second_specify',{
                                            })(
                                                <Checkbox.Group name="second_specify">
                                                    {toolBarAction.listRadios(60,'second')}
                                                </Checkbox.Group>
                                            )}
                                        </FormItem>
                                    </Form>
                                </Radio>
                            </RadioGroup>
                        </TabPane>
                        <TabPane tab="分钟" key="minute">
                            <RadioGroup name="minuteGroup" defaultValue={1} onChange={toolBarAction.onChange}>
                                <Radio style={radioStyle} value={1}>分钟 允许的通配符[, - * /]</Radio>
                                <Radio style={radioStyle} value={2}>
                                    <tr>
                                        <Form layout="inline">
                                            周期从
                                            <FormItem>
                                                {getFieldDecorator('minute_start',{
                                                    initialValue: 0
                                                })(
                                                    <InputNumber size="small" min={0} max={59} />
                                                )}
                                            </FormItem>
                                            -
                                            <FormItem>
                                                {getFieldDecorator('minute_end',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={0} max={59} />
                                                )}
                                            </FormItem>
                                            分钟
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={3}>
                                    <tr>
                                        <Form layout="inline">
                                            从
                                            <FormItem>
                                                {getFieldDecorator('minute_point',{
                                                    initialValue: 0
                                                })(
                                                    <InputNumber size="small" min={0} max={59} />
                                                )}
                                            </FormItem>
                                            分钟开始,每
                                            <FormItem>
                                                {getFieldDecorator('minute_step',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={59} />
                                                )}
                                            </FormItem>
                                            分钟执行一次
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={4}>
                                    指定<br/>
                                    <Form layout="inline">
                                        <FormItem>
                                            {getFieldDecorator('minute_specify',{
                                            })(
                                                <Checkbox.Group name="minute_specify">
                                                    {toolBarAction.listRadios(60,'minute')}
                                                </Checkbox.Group>
                                            )}
                                        </FormItem>
                                    </Form>
                                </Radio>
                            </RadioGroup>
                        </TabPane>
                        <TabPane tab="小时" key="hour">
                            <RadioGroup name="hourGroup" defaultValue={1}>
                                <Radio style={radioStyle} value={1}>小时 允许的通配符[, - * /]</Radio>
                                <Radio style={radioStyle} value={2}>
                                    <tr>
                                        <Form layout="inline">
                                            周期从
                                            <FormItem>
                                                {getFieldDecorator('hour_start',{
                                                    initialValue: 0
                                                })(
                                                    <InputNumber size="small" min={0} max={23} />
                                                )}
                                            </FormItem>
                                            -
                                            <FormItem>
                                                {getFieldDecorator('hour_end',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={0} max={23} />
                                                )}
                                            </FormItem>
                                            小时
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={3}>
                                    <tr>
                                        <Form layout="inline">
                                            从
                                            <FormItem>
                                                {getFieldDecorator('hour_point',{
                                                    initialValue: 0
                                                })(
                                                    <InputNumber size="small" min={0} max={23} />
                                                )}
                                            </FormItem>
                                            小时开始,每
                                            <FormItem>
                                                {getFieldDecorator('hour_step',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={24} />
                                                )}
                                            </FormItem>
                                            小时执行一次
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={4}>
                                    指定<br/>
                                    <Form layout="inline">
                                        <FormItem>
                                            {getFieldDecorator('hour_specify',{
                                            })(
                                                <Checkbox.Group name="hour_specify">
                                                    {toolBarAction.listRadios(24,'minute')}
                                                </Checkbox.Group>
                                            )}
                                        </FormItem>
                                    </Form>
                                </Radio>
                            </RadioGroup>
                        </TabPane>
                        <TabPane tab="日" key="day">
                            <RadioGroup name="dayGroup" defaultValue={1}>
                                <Radio style={radioStyle} value={1}>日 允许的通配符[, - * /]</Radio>
                                <Radio style={radioStyle} value={5}>不指定</Radio>
                                <Radio style={radioStyle} value={2}>
                                    <tr>
                                        <Form layout="inline">
                                            周期从
                                            <FormItem>
                                                {getFieldDecorator('day_start',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={31} />
                                                )}
                                            </FormItem>
                                            -
                                            <FormItem>
                                                {getFieldDecorator('day_end',{
                                                    initialValue: 2
                                                })(
                                                    <InputNumber size="small" min={2} max={31} />
                                                )}
                                            </FormItem>
                                            日
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={3}>
                                    <tr>
                                        <Form layout="inline">
                                            从
                                            <FormItem>
                                                {getFieldDecorator('day_point',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={31} />
                                                )}
                                            </FormItem>
                                            日开始,每
                                            <FormItem>
                                                {getFieldDecorator('day_step',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={31} />
                                                )}
                                            </FormItem>
                                            天执行一次
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={7}>
                                    <tr>
                                        <Form layout="inline">
                                            每月
                                            <FormItem>
                                                {getFieldDecorator('day_time',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={31} />
                                                )}
                                            </FormItem>
                                            号最近的那个工作日
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={6}>
                                    本月最后一天
                                </Radio>
                                <Radio style={radioStyle} value={4}>
                                    指定<br/>
                                    <Form layout="inline">
                                        <FormItem>
                                            {getFieldDecorator('day_specify',{
                                            })(
                                                <Checkbox.Group name="day_specify">
                                                    {toolBarAction.listRadios(31,'day')}
                                                </Checkbox.Group>
                                            )}
                                        </FormItem>
                                    </Form>
                                </Radio>
                            </RadioGroup>
                        </TabPane>
                        <TabPane tab="月" key="month">
                            <RadioGroup name="monthGroup" defaultValue={1}>
                                <Radio style={radioStyle} value={1}>月 允许的通配符[, - * /]</Radio>
                                <Radio style={radioStyle} value={5}>不指定</Radio>
                                <Radio style={radioStyle} value={2}>
                                    <tr>
                                        <Form layout="inline">
                                            周期从
                                            <FormItem>
                                                {getFieldDecorator('month_start',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={12} />
                                                )}
                                            </FormItem>
                                            -
                                            <FormItem>
                                                {getFieldDecorator('month_end',{
                                                    initialValue: 2
                                                })(
                                                    <InputNumber size="small" min={2} max={12} />
                                                )}
                                            </FormItem>
                                            月
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={3}>
                                    <tr>
                                        <Form layout="inline">
                                            从
                                            <FormItem>
                                                {getFieldDecorator('month_point',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={31} />
                                                )}
                                            </FormItem>
                                            日开始,每
                                            <FormItem>
                                                {getFieldDecorator('month_step',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={12} />
                                                )}
                                            </FormItem>
                                            月执行一次
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={4}>
                                    指定<br/>
                                    <Form layout="inline">
                                        <FormItem>
                                            {getFieldDecorator('month_specify',{
                                                initialValue: [0]
                                            })(
                                                <Checkbox.Group name="month_specify">
                                                    {toolBarAction.listRadios(12,'month')}
                                                </Checkbox.Group>
                                            )}
                                        </FormItem>
                                    </Form>
                                </Radio>
                            </RadioGroup>
                        </TabPane>
                        <TabPane tab="周" key="week">
                            <RadioGroup name="weekGroup" defaultValue={1}>
                                <Radio style={radioStyle} value={1}>周 允许的通配符[, - * /]</Radio>
                                <Radio style={radioStyle} value={5}>不指定</Radio>
                                <Radio style={radioStyle} value={2}>
                                    <tr>
                                        <Form layout="inline">
                                            周期从星期
                                            <FormItem>
                                                {getFieldDecorator('week_start',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={7} />
                                                )}
                                            </FormItem>
                                            -
                                            <FormItem>
                                                {getFieldDecorator('week_end',{
                                                    initialValue: 2
                                                })(
                                                    <InputNumber size="small" min={2} max={7} />
                                                )}
                                            </FormItem>
                                            月
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={8}>
                                    <tr>
                                        <Form layout="inline">
                                            第
                                            <FormItem>
                                                {getFieldDecorator('week_point',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={4} />
                                                )}
                                            </FormItem>
                                            周 的星期
                                            <FormItem>
                                                {getFieldDecorator('week_step',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={7} />
                                                )}
                                            </FormItem>
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={9}>
                                    <tr>
                                        <Form layout="inline">
                                            本月最后一个星期
                                            <FormItem>
                                                {getFieldDecorator('week_time',{
                                                    initialValue: 1
                                                })(
                                                    <InputNumber size="small" min={1} max={7} />
                                                )}
                                            </FormItem>
                                        </Form>
                                    </tr>
                                </Radio>
                                <Radio style={radioStyle} value={4}>
                                    指定<br/>
                                    <Form layout="inline">
                                        <FormItem>
                                            {getFieldDecorator('week_specify',{
                                            })(
                                                <Checkbox.Group name="week_specify">
                                                    {toolBarAction.listRadios(7,'week')}
                                                </Checkbox.Group>
                                            )}
                                        </FormItem>
                                    </Form>
                                </Radio>
                            </RadioGroup>
                        </TabPane>
                        <TabPane tab="年" key="7">
                            <RadioGroup name="yearGroup" defaultValue={1}>
                                <Radio style={radioStyle} value={1}>不指定 允许的通配符[, - * /] 非必填</Radio>
                                <Radio style={radioStyle} value={5}>每年</Radio>
                                <Radio style={radioStyle} value={2}>
                                    <tr>
                                        <Form layout="inline">
                                            周期从
                                            <FormItem>
                                                {getFieldDecorator('year_start',{
                                                    initialValue: 2017
                                                })(
                                                    <InputNumber size="small" min={2017} />
                                                )}
                                            </FormItem>
                                            -
                                            <FormItem>
                                                {getFieldDecorator('year_end',{
                                                    initialValue: 2018
                                                })(
                                                    <InputNumber size="small" min={2018} />
                                                )}
                                            </FormItem>
                                            月
                                        </Form>
                                    </tr>
                                </Radio>
                            </RadioGroup>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}


//校验从父组件传递的属性值是否符合
CronModal.propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default Form.create()(CronModal)