import React from "react";
import { DevSettings, Dimensions } from "react-native";
import styled from "styled-components/native";
import PropTypes from 'prop-types';

const StyledInput = styled.TextInput.attrs( ({ theme })=> ({
    placeholderTextColor: theme.main,
}) )`
    width : ${ ({width})=>width-40 }px;
    height: 60;
    margin: 3px 0;
    padding: 15px 20px;
    border: 1px solid #9296F0;
    border-radius: 10px;
    background-color: ${ ({theme})=> theme.background };
    font-size: 18px;
    color: ${ ({theme})=> theme.text };
`;

// App.js의 prop 객체를 가져오기. 구조분해
// Dimensions : React Native에서 제공하는 모듈 중 하나. 디바이스의 화면 크기와 관련된 정보를 제공(https://reactnative.dev/docs/dimensions)
// get: Dimensions객체의 메서드 / 'window': 차원의 종류, 즉 디바이스 화면의 크키. )=> 화면의 너비 정보를 'width'변수에 할당
const Input = ({
    placeholder,
    value,
    onChangeText,
    onSubmitEditing,
    onBlur, }) => {
        const { width } = Dimensions.get('window');
    return(
        <StyledInput 
            width={width}
            placeholder={placeholder}
            maxLength={50}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            onBlur={onBlur}
        />
    );
};


//유효성 체크
Input.PropTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
};

export default Input;