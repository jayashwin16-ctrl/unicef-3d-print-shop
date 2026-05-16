type BarrierRowProps = {
  icon: string;
  title: string;
  body: string;
  stat: string;
};

export default function BarrierRow({ icon, title, body, stat }: BarrierRowProps) {
  return (
    <div className="mx-auto mb-9 flex max-w-[700px] gap-5">
      <div className="min-w-[50px] text-center text-4xl">{icon}</div>
      <div>
        <h3 className="mb-2 text-lg font-bold text-brand-heading">{title}</h3>
        <p className="text-sm leading-relaxed text-[#333]">{body}</p>
        <p className="mt-2 text-sm font-bold text-brand-blue">{stat}</p>
      </div>
    </div>
  );
}
