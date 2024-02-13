export default function TitleEditor({
  title,
  setTitle,
  setSaveStatus,
}: {
  title: string;
  setTitle: (title: string) => void;
  setSaveStatus: (status: string) => void;
}) {
  return (
    <input
      className="w-full bg-background py-8 text-center text-6xl focus:outline-none"
      defaultValue={title}
      placeholder="Title"
      onChange={(e) => {
        setSaveStatus("Unsaved");
        setTitle(e.target.value);
      }}
    ></input>
  );
}
