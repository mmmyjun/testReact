import { useState, useEffect, useMemo } from 'react';
import { Input, Table, DateRangePicker, Button, Form, FormGroup, FormControl, ControlLabel, Modal } from 'rsuite';
import mock from './mock'
import axios from 'axios'


const { Column, HeaderCell, Cell, Pagination } = Table;

export default function TableFilter({ className, ...rest }) {
    const [state, setState] = useState({
        fakeLargeData: [],
        addOrEditItem: null,
        showModal: false,
        curButtonFlag: 1, // 当前点击的是 新增(1) 还是 编辑(2)
        searchVal: '',
        searchTime: ''
    })

    const [filter, setFilter] = useState({
        keyword: '',
        start: 0,
        end: 0
    })

    useEffect(() => {
        getData();
        console.log('created...')

        return () => {
            console.log('destroy...');
        }
    }, [])

    function getData() {
        axios.get('/api/v1/get/tabledata').then((res) => {
            setState((state) => {
                return {
                    ...state,
                    fakeLargeData: res.data.data
                }
            })
        })
    }

    const setModelVisible = () => {
        setState((state) => {
            return {
                ...state,
                showModal: false
            }
        })
    }

    function getTime(t) {
        const date = t ? new Date(t) : new Date();

        const yMD = getYMD(date);

        const h = (date.getHours()).toString().padStart(2, 0);
        const m = (date.getMinutes()).toString().padStart(2, 0);
        const s = (date.getSeconds()).toString().padStart(2, 0);

        return yMD + ' ' + h + ':' + m + ':' + s;
    }
    function getYMD(date) {
        if (date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, 0);
            const day = (date.getDate()).toString().padStart(2, 0);
            return year + '-' + month + '-' + day;
        }
    }

    const addItem = () => {
        setState(state => {
            return {
                ...state,
                curButtonFlag: 1,
                addOrEditItem: {
                    id: Date.now(),
                    basename: '',
                    content: '',
                    time: getTime()

                },
                showModal: true
            }
        })
    }

    const onConfirm = (modalData) => {
        if (state.curButtonFlag == 2) { // 当前点击的是编辑
            setState((state) => {
                return {
                    ...state,
                    fakeLargeData: state.fakeLargeData.map(item => {
                        if (item.id == modalData.id) {
                            return modalData
                        } else {
                            return { ...item }
                        }
                    }),
                    showModal: false
                }
            })
        } else { // 当前点击的是新增
            setState((state) => {
                return {
                    ...state,
                    fakeLargeData: [
                        ...state.fakeLargeData,
                        modalData
                    ],
                    showModal: false
                }
            })
        }
    }

    const onSearch = () => {
        let startT = 0;
        let endT = 0;
        if (state.searchTime) {
            const s = state.searchTime.split(' ~ ');
            startT = new Date(s[0] + ' 00:00:00').getTime();
            endT = new Date(s[1] + ' 23:59:59').getTime();
        }

        setFilter({
            keyword: state.searchVal,
            start: startT,
            end: endT
        })
    }

    const filterdList = useMemo(() => {
        return state.fakeLargeData.filter(item => {
            const valInclude = item.basename.indexOf(filter.keyword) > -1 || item.content.indexOf(filter.keyword) > -1;
            const curTimeStamp = new Date(item.time).getTime();
            const timeInclude = filter.start ? (curTimeStamp >= filter.start && curTimeStamp <= filter.end) : true;
            return valInclude && timeInclude;
        });
    }, [filter, state.fakeLargeData])

    const changeSearchInput = (value) => {
        setState((state) => {
            return {
                ...state,
                searchVal: value
            }
        })
    }

    const changeSearchDate = (value) => {
        setState((state) => {
            return {
                ...state,
                searchTime: getYMD(value[0]) ? (getYMD(value[0]) + ' ~ ' + getYMD(value[1])) : ''
            }
        })
    }

    const searchBtnProps = {
        appearance: 'primary',
        onClick: onSearch
    }

    function handleEdit(rowData) {
        setState(state => {
            return {
                ...state,
                curButtonFlag: 2,
                addOrEditItem: {
                    ...rowData,
                    time: getTime()
                },
                showModal: true
            }
        })
        
    }

    function handleDelete(rowData) {
        const id = rowData.id;
        const idx = state.fakeLargeData.findIndex(e => e.id == id);
        const list = [...state.fakeLargeData];
        list.splice(idx, 1);
        setState((state) => {
            return {
                ...state,
                fakeLargeData: list
            }
        })
    }


    return (
        <div { ...rest }>
            <Input placeholder="Default Input" onChange={changeSearchInput} />
            <DateRangePicker format="YYYY-MM-DD" onChange={changeSearchDate}
                locale={{ sunday: '日', monday: '一', tuesday: '二', wednesday: '三', thursday: '四', friday: '五', saturday: '六', ok: '确定', today: '今天', yesterday: '昨天', last7Days: '最近 7 天' }}
            />

            <Button { ...searchBtnProps }>查询</Button>

            <Button appearance="primary" onClick={addItem}>新增</Button>
            <Table
                virtualized
                height={400}
                data={filterdList}
                onRowClick={data => {
                    console.log(data);
                }}
            >
                <Column width={130}>
                    <HeaderCell>标题</HeaderCell>
                    <Cell dataKey="basename" />
                </Column>
                <Column width={130}>
                    <HeaderCell>内容</HeaderCell>
                    <Cell dataKey="content" />
                </Column>
                <Column width={200}>
                    <HeaderCell>创建时间</HeaderCell>
                    <Cell dataKey="time" />
                </Column>
                <Column width={120} fixed="right">
                    <HeaderCell>操作</HeaderCell>
                    <Cell>
                        {
                            rowData => {
                                return (
                                    <span>
                                        <a onClick={() => handleEdit(rowData)}> Edit </a> |{' '}
                                        <a onClick={() => handleDelete(rowData)}> Remove </a>
                                    </span>
                                )
                            }
                        }
                    </Cell>
                </Column>
            </Table>

            <ChildModal show={state.showModal} data={state.addOrEditItem} setModelVisible={setModelVisible} onConfirm={onConfirm} />

            {/* <div style={{ paddingTop: 100 }}>5345</div> */}

        </div>
    )
}

const ChildModal = ({ data, show, setModelVisible, onConfirm }) => {
    let modalData = data;
    const onChange = (formValue, e) => {
        console.log(formValue)
        modalData = formValue;
    }

    const formValue = useMemo(() => {
        if (show) {
            const { id, ...rest } = data;
            return rest;
        }
        return {}
    }, [data, show])

    return (
        <div className="modal-container">
            <Modal show={show} backdrop onHide={setModelVisible}> 
                <Modal.Header>
                    <Modal.Title>表格内容</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form formDefaultValue={formValue} onChange={onChange}>
                        <FormGroup>
                            <ControlLabel>标题</ControlLabel>
                            <FormControl name="basename" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>内容</ControlLabel>
                            <FormControl name="content" />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={setModelVisible} appearance="primary" onClick={() => {
                        onConfirm({ ...data, ...modalData })
                    }}>Ok</Button>
                    <Button onClick={setModelVisible} appearance="subtle">Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
