import {  Box } from '@mui/material';


import './detail.css'

export default function Detail() {
    return <div className="detailed">
        <img src="./Logo.png"  className="imglogo" />
        <Box className="boxo" >
            <div className="flexo">
            <h3 className="hero" >
            
             What is 30 Days of Code?</h3>
            <p className="lists" ><ul><li>It is a coding contest for students to enhance there coding knowledge and boost their contribution activity on GitHub.</li></ul></p>
<br />
            <h3 className="hero" >How to Participate?</h3>


            <ul className="lists">
                <li>
                 Enter your Github ID 
                </li>

                <li>
                   Enter the link of the repository of your projects where will you be sumbitting your commits
                </li>

            </ul>

            
            <h3 className="hero">Benefits</h3>
            

   <ul className="lists">
    <li>
    Enhance your coding skills by developing a great project on your own.  
    </li>

    <li>
    Boost your Open-Source contribution on GitHub.com.
    </li>

    <li>
    Have a chance to win exciting prizes on top ranks. 
    </li>
   </ul>

<h3 className="hero">Rules</h3>
<ul className="lists">
    <li>
        be limitless
    </li>
</ul>



   </div>
        </Box>

    </div>
}