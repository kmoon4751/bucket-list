import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, Dimensions, Alert, TouchableOpacity, Text } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Input from './components/Input';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

//로딩화면 유지
SplashScreen.preventAutoHideAsync();

//SafeAreaView: styled-components 라이브러리 내장 컴포넌트
// attrs : 컴포넌트에 속성 부여
const Container = styled.SafeAreaView.attrs(null)`
 flex: 1;
 background-color: ${ ({ theme })=>theme.background };
 align-items: center;
 justify-content: flex-start;
`;

//Text: styled-components 라이브러리 내장 컴포넌트
const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${ ({ theme })=> theme.main };
  align-self: center;
  margin: 0 20px;
`;


//ScrollView: styled-components 라이브러리 내장 컴포넌트
const List = styled.ScrollView`
  flex: 1;
  width: ${ ({ width })=>width-40}px;
`;

const App = () => {
  
  //상태 변수 생성
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState({});
  //앱 준비상태 여부를 판단하는 상태변수
  const [appIsReady, setAppIsReady] = useState(false);

  //로컬파일에 저장
  //tasks: 객체리터럴 데이터를 통채로 받아오기
  //자바스크립트객체를 문자열로 변환하는 메소드. js obj => json포맷의 문자열로 저장
  const saveTasks = async tasks => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
    }catch(error){
      console.log(error.message);
    }
  };

  //로컬파일에서 읽어오기
  const loadTask = async ()=> {
    try {
      const loadedTasks = await AsyncStorage.getItem('tasks');
      setTasks(JSON.parse(loadedTasks || '{}'));
    }catch(error){
      console.log(error.message);
    }
  };

  useEffect( ()=>{
    async function prepare(){
      try{
        await loadTask();
      }catch(e){
        console.warn(e);
      }finally{
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  //어플이 실행욀 때 또는 컨테이너 레이아웃이 재계산될 때 마다 수행
  const onLayoutRootView = useCallback(async ()=>{
    if(appIsReady){
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if(!appIsReady) return null;

  // 입력 항목이 수정될 때마다 수정된 내용을 newTask변수에 저장
  const h_onChangeText = (text)=>{
    setNewTask(text);
  };

  // h_onSubmitEditing: 새 항목 추가
  // Date.now().toString(): 현재 시간을 기반으로 생성된 고유한 키를 만들기 위한 코드
  // Date.now(): 1970년 1월 1일 자정으로부터 현재까지의 밀리초(ms)를 반환하는 함수
  // toString(): 숫자를 문자열로 변환
  const h_onSubmitEditing = ()=>{
    const key = Date.now().toString(); 
    const newTaskObject = {
      [key] : {id : key, text:newTask, completed:false}
    }
    setNewTask(''); //입력창 초기화
    setTasks({...tasks, ...newTaskObject}); //스프레드 연산자. 객체리터럴을 합친것.(기존의리스트+새롭게추가된것)
  };

  // 항목 삭제
  const h_deleteTask = (id)=> { 
    Alert.alert('', '정말 삭제하시겠습니까?',[
      {text:'취소', onPress:()=>console.log('취소!')},
      {text:'삭제', onPress:()=> delete currentTasks[id]}
    ]);
    const currentTasks = {...tasks};
    setTasks(currentTasks);
  };

  // 완료된 항목만 모두 삭제
  const h_deleteTaskall = (id)=>{
    const currentTasks = {...tasks};

    Alert.alert('', '정말 삭제하시겠습니까?',[
      {text:'취소', onPress:()=> console.log('취소!')},
      {text:'삭제', onPress:()=>{
        const completedTaskIds = Object.keys(currentTasks).filter(
          (id) => currentTasks[id].completed
        );
        if (completedTaskIds.length === 0) {
          Alert.alert('', '완료된 항목이 없습니다.');
          return;
        }
        completedTaskIds.forEach((id) => {
          delete currentTasks[id];
        });
      }}
    ]);
    setTasks(currentTasks);
  }

  // 항목 완료/미완료 로직  
  const h_toggleTask = (id)=> {
    const currentTasks = {...tasks};
    currentTasks[id].completed = !currentTasks[id].completed;
    setTasks(currentTasks);
  };

  // 항목 수정
  const h_updateTask = (task)=> {
    const currentTasks = {...tasks};
    currentTasks[task.id] = task;
    setTasks(currentTasks);
  };
  
  //등록 취소
  const h_onBlur = ()=>{
    setNewTask('');
  };

  const { width } = Dimensions.get('window');

  return (
    <ThemeProvider theme={theme}>
      <Container onLayout={onLayoutRootView}>
        {/* 상태표시줄 설정 */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.background}
      />

      <Title>버킷리스트</Title>

      {/* 인풋 설정 */}
      <Input
        placeholder="+ 항목추가"
        value={newTask}                       
        onChangeText={h_onChangeText}        // 새로운 항목 핸들러 
        onSubmitEditing={h_onSubmitEditing} // 추가 핸들러
        onBlur={h_onBlur}                   // 포커스를 벗어나면 호출
      />

      {/* 버킷리스트들 */}
      <List width={width}>
        {
          Object.values(tasks)
                .reverse()
                .map( task => (
                  <Task key = {task.id}
                    task={task}
                    deleteTask={h_deleteTask} //삭제
                    toggleTask={h_toggleTask} //완료 or 미완료
                    updateTask={h_updateTask} //수정
                  />
                ) )}
      </List>

      {/* 완료된 항목만 삭제하는 버튼 */}
      <TouchableOpacity style={{
      backgroundColor: '#9296F0',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '80%'
      }} onPress={h_deleteTaskall}>
      <Text style={{ color: 'white' }}>완료항목 모두 삭제</Text>
      </TouchableOpacity>

    </Container>
    </ThemeProvider>
  );
};

export default App;