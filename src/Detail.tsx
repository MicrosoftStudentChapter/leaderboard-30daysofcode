import { Typography, Box, ListItem, List } from '@mui/material';

export default function Detail() {
    return <div>
        <Box sx={{ m: 2 }}>
            <Typography variant="h3">What is 30 Days of Code?</Typography>
            <Typography >It is a coding contest for students to enhance there coding knowledge and boost their contribution activity on GitHub.</Typography>
<br />
            <Typography variant="h3">How to Participate?</Typography>

            <List sx={{ listStyleType: "number", listStylePosition: 'inside' }}>
                <ListItem sx={{ display: 'list-item' }}>
                    Enter your Github ID.
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    Enter the link of the repository of your projects where will you be sumbitting your commits.
                </ListItem>
            </List>


            <Typography variant="h3">Benefits</Typography>
            <List sx={{ listStyleType: "number", listStylePosition: 'inside' }}>
                <ListItem sx={{ display: 'list-item' }}>
                    Enhance your coding skills by developing a great project on your own.
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    Boost your Open-Source contribution on GitHub.com.
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    Have a chance to win exciting prizes on top ranks.
                </ListItem>
            </List>
        </Box>

    </div>
}