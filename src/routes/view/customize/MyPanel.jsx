/**
 * Created by 叶子 on 2017/7/31.
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Modal, Tabs, Button, Radio, Checkbox, Input, InputNumber, Form, Row, Col } from 'antd'
import CronModal from './../../../components/cron/CronModal'
import Circle from './../../../components/circle/Circle'
import './style/MyPanel.less'

class MyPanel extends Component {
    state = {
        visible: false,
        value: '测试',
        modalVisible: false,
    }

    /*生命周期函数--->该方法在完成首次渲染之前被调用*/
    componentWillMount() {
        /* 设置推荐时段的状态*/
    }
    /*首次使用组建类时,组件已经被渲染，DOM操作请放在这*/
    componentDidMount() {
    }
    /*存在期：随着应用状态的改变，以及组件逐渐受到影响，你将会看到下面的方法一次被调用：*/
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    /**
     *条件：当组件确定要更新，在 render 之前调用
     *用处：这个时候可以确定一定会更新组件，可以执行更新前的操作
     *注意：方法中不能使用 setState ，setState 的操作应该在 componentWillReceiveProps 方法中调用
     * @param nextProps
     * @param nextState
     */
    componentWillUpdate(nextProps, nextState) {
    }

    /**
     * 组件已经被更新后的方法
     * @param nextProps
     * @param nextState
     */
    componentDidUpdate(nextProps, nextState) {
    }

    render() {
       const {modalVisible} = this.state,
       FormItem = Form.Item,
           formItemLayout = {
               labelCol: {
                   span: 6
               },
               wrapperCol: {
                   span: 12,
                   offset:1
               }
           },
           { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form,// 表单对用的处理
           toolBarAction = {
           showModal : () =>{
               this.setState({ visible: true });
           },
           hiddenModal : () => {
               this.setState({ visible: false });
           },
               showMModal : () =>{
                   this.setState({ modalVisible: true });
               },
               hiddenMModal : () => {
                   this.setState({ modalVisible: false });
               },
           getCron: (params) => {
               console.error('cron表达式：',params)
               this.setState({ visible: false,value: params });
           }
       },

       circleCfg = {
           percent: 75, // 进度
           strokeWidth: 30, // 进度线的宽度
           strokeColor: 'red', // 进度条的颜色
           width: 150, // 进度条画布的宽
       },

        modal = {
            title: '测试窗口',
            visible: modalVisible,
            style: {top: 80},
            maskClosable: false,
            onCancel: toolBarAction.hiddenMModal,
            footer: [
                <Button className="left">测试一</Button>,
                <Button className="left">测试二</Button>,
                <Button className="left">测试三</Button>,
                <Button>确认</Button>,
                <Button>取消</Button>
            ]
        }


        console.error('state:',this.state)

        return (
            <div style={{width:'800px'}}>
                <Form layout={'horizontal'}>
                    <FormItem
                        label="Cron表达式"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('etlCron')(
                            <Row gutter={10} type="flex" align="middle" justify="start">
                                <Col span={8} style={{width: '80%'}}>
                                    {getFieldDecorator('requestData',{
                                        initialValue: this.state.value
                                    })(
                                        <Input />
                                    )}
                                </Col>
                                <Col span={1} offset={1}>
                                    <Button onClick={toolBarAction.showModal}>配置</Button>
                                </Col>
                            </Row>
                        )}
                    </FormItem>,
                </Form>
                <CronModal visible={this.state.visible} onOk={toolBarAction.getCron} onCancel={toolBarAction.hiddenModal}/>
                {/*<Circle {...circleCfg}></Circle>*/}
                <Button onClick={toolBarAction.showMModal}>测试窗口</Button>
                <Modal {...modal}></Modal>
            </div>
        )
    }
}

export default Form.create()(MyPanel)