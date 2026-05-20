import Image from "next/image";

type Member = { id: string; name: string; role: string; image: string };

export function MembersSection({ members }: { members: Member[] }) {
  return (
    <section className="section" id="members">
      <div className="container">
        <h2 className="section-heading">Členové</h2>
        <p className="section-text">Základní obsazení lze později rozšířit o další spolupracující interprety.</p>
        <div className="members-grid">
          {members.map((member) => (
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
