import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  CardActions,
  Typography,
  CardMedia,
  Paper,
  InputBase,
  Divider,
  Avatar,
  Link,
} from "@mui/material";
import Comment from "./Comment";
import PostModal from "./PostModal";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fafafa",
  },
  buttonContainer: {
    textAlign: "center",
  },
}));

const Post = (props) => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Card sx={{ my: "25px" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="Chad"
            src={props.author.profileImage}
            sx={{ width: 38, height: 38, marginRight: 2 }}
            onClick={() => {
              const words = props.author.id.split("/");
              const word = words[words.length - 1];
              navigate(`/app/author/${word}`, { state: props.author });
            }}
          />
          <Typography variant="body1" color="text.primary" fontWeight="600">
            {props.title}
          </Typography>
        </Box>
        <IconButton aria-label="settings">
          <MoreHorizIcon />
        </IconButton>
      </CardContent>
      {props.contentType === "text/plain" && (
        <CardContent className={classes.root}>
          <Typography variant="body1" color="text.primary">
            {props.content}
          </Typography>
        </CardContent>
      )}
      {props.contentType === "image/png;base64" && (
        <CardContent className={classes.root} sx={{ padding: 0 }}>
          <CardMedia
            component="img"
            height="600"
            image={props.content}
            alt="selfie"
          />
        </CardContent>
      )}
      <CardActions
        className={classes.root}
        disableSpacing
        sx={{ paddingBottom: "5px" }}
      >
        <IconButton aria-label="add to favorites">
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton aria-label="comment">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <CardContent
        sx={{ py: "0px", paddingBottom: 0 }}
        className={classes.root}
      >
        <Typography
          variant="body2"
          color="text.primary"
          fontWeight="600"
          sx={{ paddingBottom: 0.5 }}
        >
          8,032 likes
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Link
            component="button"
            variant="body2"
            underline="hover"
            fontWeight="600"
            sx={{ marginRight: 1 }}
            onClick={() => {
              const words = props.author.id.split("/");
              const word = words[words.length - 1];
              navigate(`/app/author/${word}`, { state: props.author });
            }}
          >
            {props.author.displayName}
          </Link>
          <Typography variant="body2" color="text.secondary" fontSize="10pt">
            {props.description}
          </Typography>
        </Box>
        <Link
          component="button"
          variant="body2"
          color="text.secondary"
          fontWeight="600"
          underline="hover"
          onClick={() => setIsModalOpen(true)}
        >
          View all comments
        </Link>
      </CardContent>
      {/* Comments */}
      <CardContent className={classes.root} sx={{ py: 1 }}>
        {props.comments.map((comment, idx) => (
          <Comment
            key={idx}
            user={comment.author.displayName}
            comment={comment.comment}
          />
        ))}
      </CardContent>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Comment..."
          inputProps={{ "aria-label": "comment" }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: "10px" }} aria-label="send">
          <SendIcon />
        </IconButton>
      </Paper>
      <PostModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        post={props}
      />
    </Card>
  );
};

export default Post;
