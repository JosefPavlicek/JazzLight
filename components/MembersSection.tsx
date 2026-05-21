import Image from "next/image";

type Member = {
  id: string;
  name: string;
  role: string;
  image: string;
};

type MembersSectionProps = {
  members: Member[];
  title: string;
  text: string;
  josefRole: string;
  singerName: string;
  singerRole: string;
};

export function MembersSection({
  members,
  title,
  text,
  josefRole,
  singerName,
  singerRole,
}: MembersSectionProps) {
  const localizedMembers = members.map((member) => {
    if (member.id === "josef") return { ...member, role: josefRole };
    if (member.id === "singer") return { ...member, name: singerName, role: singerRole };
    return member;
  });

  return (
    <section className="section" id="members">
      <div className="container">
        <h2 className="section-heading">{title}</h2>
        <p className="section-text">{text}</p>

        <div className="members-grid">
          {localizedMembers.map((member) => (
            <article key={member.id} className="member-card">
              <Image className="member-photo" src={member.image} alt={member.name} width={420} height={420} />
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
