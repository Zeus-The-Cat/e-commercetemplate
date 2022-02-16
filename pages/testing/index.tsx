import {useState, useEffect} from "react"
import {CSSPlugin, gsap} from "gsap"
import {ZTC} from '../../lib/utils'
import styles from '../../styles/Testing.module.sass'

// gsap.registerPlugin(ScrollTrigger)

export default function Page() {
    const plugins = [ CSSPlugin ]; // Required for Tree Shaking
    // State
    const [button,setButton] = useState(false)
    const [group, setGroup] = useState(false)
    const [alert, setAlert] = useState(false)
    // Constants
    const groupList = Array.from({length: 5}, (item, index)=> index)

    useEffect(() =>{
        // button animation
        if (button){
            let t1 = gsap.timeline({
                repeat: 1, 
                repeatDelay: 1, 
                yoyo:true, 
                delay:0.25, 
                onComplete:() => {setButton(false)}
                })
            t1.to(`.${styles.box}`,{
                x: 400,
                rotation: 360,
                duration:1,
            }).to(`.${styles.box}`,{
                y: 400,
                duration:1
            })
        }
    },[button])

    useEffect(() =>{
        // Group Animation    
        if(group){
            let t2 = gsap.timeline({
                repeat:1,
                repeatDelay:0,
                yoyo:true,
                onComplete:() => {setGroup(false)}
                })
            let position = ">-0.5"
            let s = groupList.reduce((prev,current,index)=>{
                index == 0 ? position = "+=0" : position = ">-0.5"
                prev.to(`.${styles[`box${index}`]}`,{
                    x: 200,
                    duration:1,
                    yoyo:true,
                },position)
                return prev
            },t2)
        }
    },[group,groupList])

    useEffect(() =>{
        let tl = gsap.timeline({repeat:0, defaults:{ease:'sine'}})
        if(alert){
            tl.to(`.${styles.alert}`,{
                y: 100
            }).set(`.${styles.alert}`,{
                zIndex:3
            }).to(`.${styles.alert}`,{
                y: 75,
            }).to(`.${styles.alert}`,{
                ease:'sine',
                rotate:-90,
                width: 200,
                height: 150
            },"<")
        }else{
            tl.to(`.${styles.alert}`,{
                y:100
            }).to(`.${styles.alert}`,{
                ease:'sine',
                rotate: 0,
                width: 150,
                height: 90
            },'<').set(`.${styles.alert}`,{
                zIndex: 1,
            }).to(`.${styles.alert}`,{
                y:0
            })
        }
    },[alert])

  return (
    <main>
        <h3>Basic Example</h3>
        <div className={styles.box}></div>
        <button onClick={()=>IFF([button,setButton])}>{button ? 'Running' : 'Start'}</button>
        <h3>List of Elements</h3>
        {groupList.map((each)=>{
            let s:string = 'box'+each
            let [a,b] = [styles.box, styles[`box${each}`]]
            return ( <div key={each} className={`${a} ${b}`}></div>)
        })}
        <button onClick={()=>ZTC.IFF([group,setGroup])}>{group ? 'Running' : 'Start'}</button>
        <div className={styles.alertContainer}>
            <div className={styles.alertBar}></div>
            <div className={styles.alert}> Header <br />
                <span>Here is a useful hint Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
            </div>
        </div>    
        <div style={{height:'80vh'}}>
            <button onClick={()=>setAlert(!alert)}>{alert ? 'Hide' : 'Show'}</button>
        </div>
    </main>
  )
}