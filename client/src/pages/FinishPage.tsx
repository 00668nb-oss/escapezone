import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { useStory } from "../hooks/useStory";
import { Link, useParams } from "react-router-dom";

export function FinishPage() {
  const { id } = useParams();
  const roomId = Number(id);
  const { data: story, isLoading, error } = useStory(roomId);
  if (error) {
    return <ErrorMessage error={error} />;
  }
  if (isLoading || !story) return <Loading />;

  return (
    <div className="finish-page">
      <h1>{story.roomName} הסיפור המלא</h1>
      {story.puzzles.map((puzzle) => (
        <div key={puzzle.id}>
          <h3>{puzzle.title}</h3>
          <p className="story-text">{puzzle.storyText}</p>
        </div>
      ))}
      {story.finalText && <p className="final-text"> {story.finalText} </p>}
      <Link to="/rooms">חזרה לחדרים</Link>
    </div>
  );
}
