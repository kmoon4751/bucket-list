import React, {useState} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../Images';
import Input from './Input'; 

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.itemBackground};
  border-radius: 10px;
  padding: 5px;
  margin: 3px 0;
`;

const Contents = styled.Text`
    flex: 1;
    font-size: 18px;

    /* 체크박스를 누르면 색이 바뀌게*/
    color: ${({theme, completed}) => (completed ? theme.done : theme.text)};

    /* completed를 누르면 항목에 사선 넣기*/
    text-decoration-line: ${({completed})=> completed ? 'line-through' : 'none' };
`;

const Task = ({ task, deleteTask, toggleTask, updateTask }) => {

    const [text, setText] = useState(task.text);
    const [isEditing, setIsEditing] = useState(false);
    
    const h_update = () => setIsEditing(true); 

    const h_onSubmitEditing = ()=>{
        if(!isEditing) return;
        const editedTask = {...task, text };
        setIsEditing(false);
        updateTask(editedTask);
    };

    const h_onBlur = () => {
        if (isEditing) {
            setIsEditing(false); //조회모드
            setText(task.text); //수정내용 처음상태로 초기화
          }
        };



    return (
        isEditing ? 
        (
        <Input 
        value={text}
        onChangeText={setText}
        onSubmitEditing={h_onSubmitEditing}
        onBlur={h_onBlur}
        />
        ) : 
        (
            <Container>

            <IconButton type={task.completed ? images.completed : images.uncompleted } 
                        id={task.id} 
                        onPressOut={toggleTask}  />

            <Contents completed={task.completed}>{task.text}</Contents>
    
            {task.completed || (<IconButton type={images.update} onPressOut={h_update} />)}
            
            <IconButton type={images.delete} id={task.id} onPressOut={deleteTask} />
    
        </Container> )
      );
    };


// 유효성
Task.proptypes = {
  task: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
};

export default Task;