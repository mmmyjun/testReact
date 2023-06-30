import { useState, useEffect, useRef, RefObject } from 'react';
import classnames from "classnames";

export default function Clock() {

    // const [state, setState] = useState({
    //     now: new Date().toTimeString(),
    // })

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setState({
    //             now: new Date().toTimeString()
    //         })
    //     }, 1000);
    //     console.log('created..')
    //     return () => {
    //         clearInterval(timer);
    //         console.log('destroy..');
    //     }
    // }, [])

    const [state, setState] = useState({
        active: 0
    })

    const props = {
        id: 'list',
        style: {
            backgroundColor: '#eee'
        }
    }

    const ref = useRef(null);
    console.log('clock ref', ref);
    let liRef = useRef(null)
    let input1 = null
    const setCur = (currentNode, i) => {
        setState({ active: i }) 
        liRef.current=currentNode.target
        input1 = currentNode.target
        console.log('当前node', currentNode, i)
        console.log('liRef liRef', liRef, input1)
    }

    return (
        <>
            <ul ref={ ref } { ...props }>
                {
                    Array.from({length: 10}, (d, i) => (
                        <li 
                        key={ i }
                        className={ classnames('item list aaa vvv', { active: i === state.active }) }
                        onClick={ (e) => setCur(e, i)}
                        style={{ height: 30 }}>item { i + 1 } </li>
                    ))
                }
            </ul>

            <button type="button" onClick={ () => console.log(ref.current, liRef, input1) }>获取ul元素 </button>
        </>
    )
}
