const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
      <p>{note.id}</p>
    </li>
  );
};

export default Note;
