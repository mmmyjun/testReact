import { useState } from 'react';

import 'rsuite/dist/styles/rsuite-default.css';

import { Icon, Input, InputGroup, Button, Checkbox } from 'rsuite';

export default function ToDo(){
    const [state, setState] = useState({
        searchVal: '',
        list: [],
        flag: 1
    })

    const onKeyUp = (e) => {
        if (e.keyCode === 13 && e.target.value) {
            setState(state => {
                const newList = [
                    ...state.list, 
                    {
                        id: Date.now(),
                        content: state.searchVal,
                        checked: false
                    }
                ];
                return {
                    ...state,
                    list: newList,
                    searchVal: ''
                };
            })
        }
    }

    const searchInput = (value, e) => {
        setState((state) => {
           return {
                ...state,
                searchVal: value
                // list: state.list.filter(item => item.content.indexOf(value) > -1)
           }
        })
    }
    
    // const resultList = () => state.list.filter(item => {
    //     return item.content.indexOf(state.searchVal) > -1
    // });
    const resultList = () => state.flag === 1 ? state.list : (state.flag === 2 ? state.list.filter(item => !item.checked) : state.list.filter(item => item.checked));
    
    const onDelete = (item) => {
        setState((state) => {
            return {
                ...state,
                list: state.list.filter(it => it.id !== item.id)
            }
        })
    }
    
    const onChange = (item, val, checked) => {
        setState((state) => {
            return {
                ...state,
                list: state.list.map(it => {
                    if (it.id === item.id) {
                        return {
                            ...it,
                            checked: checked
                        }
                    } else {
                        return {
                            ...it
                        }
                    }
                })
            }
        })
    }

    const setFlag = (val) => {
        setState((state) => {
            return {
                ...state,
                flag: val
            }
        })
    }

    return (
        <div>
            <InputGroup >
                <Input onKeyUp={ onKeyUp } value={ state.searchVal } onChange={ (value, e) => searchInput(value, e) }   />
                <InputGroup.Button>
                    <Icon icon="search" />
                </InputGroup.Button>
            </InputGroup>

            <Child data={ resultList() }  onDelete={ onDelete } onChange={ onChange } slot={<Icon icon="search" />}> 444 </Child>

            <Button color="green" onClick={ () => setFlag(1) }>全部</Button>
            <Button color="green" onClick={ () => setFlag(2) }>未完成</Button>
            <Button color="green" onClick={ () => setFlag(3) }>已完成</Button>
        </div>
    )
}

const Child = ({data, onDelete, onChange, children, slot}) => {
    return (
        <ul>
            {
                data.map((item, index) => 
                    <li key={index}> {index + 1}:
                        <Checkbox value={item.id} checked={ item.checked } onChange={ (value, checked) => onChange(item, value, checked) }>{item.content}</Checkbox>
                        <Button color="green" onClick={ () => onDelete(item) }>删除</Button>
                    </li>
                )
            }
        </ul>
    )
}