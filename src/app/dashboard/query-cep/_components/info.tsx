export function Info({ description, title }: { title: string; description: string }) {
  return (
    <div className='flex flex-col items-center justify-center'>
      <label>{title}</label>
      <span>
        {description}
      </span>
    </div>
  );
}