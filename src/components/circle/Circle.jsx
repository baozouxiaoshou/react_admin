/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { PropTypes }  from 'react';
import classnames from 'classnames';

function Circle ({
                     percent, // 进度
                     strokeWidth, // 进度线的宽度
                     strokeColor,//进度条的颜色
                     width, // 进度条画布的宽
                     fontColor,
                     tailColor
                 }){

    let leftDeg,rightDeg,
        deg = percent*3.6,
        leftStrokeDisplay = 'block',
        rightStrokeDisplay = 'block';
    if(deg > 180){
        leftDeg =  deg -45
        rightDeg = -45
    }else if (deg === 180){
        leftDeg = 135
        rightDeg = -45
    }else {
        leftDeg = 135
        rightDeg = 135 + deg
        leftStrokeDisplay = 'none'
    }
    const boxStyle = {
            width:width,
            height:width,
            fontSize: (width - strokeWidth)/5,
            color:fontColor,
        },
        progressbarStyle = {
            borderColor: tailColor,
            borderWidth: strokeWidth
        },
        leftStrokeStyle = {
            borderWidth: strokeWidth,
            transform: `rotate(${leftDeg}deg)`,
            borderTopColor: strokeColor,
            borderLeftColor: strokeColor,
            display: leftStrokeDisplay,
        },
        rightStrokeStyle = {
            borderWidth: strokeWidth,
            transform: `rotate(${rightDeg}deg)`,
            borderRightColor: strokeColor,
            borderBottomColor: strokeColor,
        }
    return (
        <div>
            <div className={classnames({"box":true})} style={boxStyle}>
                <div className="progressbar" style={progressbarStyle}>
                    <div className="left-container">
                        <div className={classnames({"left-circle":true})} style={leftStrokeStyle}/>
                    </div>
                    <div className="right-container">
                        <div className="right-circle" style={rightStrokeStyle}/>
                    </div>
                </div>
                <div className="progressNumber">
                    <span>{percent}%</span>
                </div>
            </div>
        </div>
    )
}

Circle.defaultProps = {
    percent: 0, // 进度
    strokeWidth : 20, // 进度线的宽度
    strokeColor: 'blue',//进度条的颜色
    width: 100, // 进度条画布的宽
    fontColor: 'black',// 字体颜色
    tailColor: '#ccc' // 背景线颜色
}

Circle.propTypes = {
    percent: PropTypes.number, // 进度
    strokeWidth: PropTypes.number, // 进度线的宽度
    strokeColor: PropTypes.string,//进度条的颜色
    width: PropTypes.number, // 进度条画布的宽度
    fontColor: PropTypes.string,// 字体颜色
    tailColor: PropTypes.string // 背景线颜色
};

export default Circle;