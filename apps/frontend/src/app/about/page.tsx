'use client';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ჩვენს შესახებ</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          SabaP არის მოწინავე დოკუმენტების მართვის პლატფორმა, რომელიც გთავაზობთ მარტივ და ეფექტურ გზას თქვენი დოკუმენტების მართვისთვის.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">ჩვენი მისია</h2>
        <p className="mb-4">
          ჩვენი მისიაა გავხადოთ დოკუმენტების მართვა მარტივი და ეფექტური. ჩვენ ვქმნით ინსტრუმენტებს, რომლებიც დაგეხმარებათ:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>დოკუმენტების მარტივად ატვირთვა და მართვა</li>
          <li>დოკუმენტების უსაფრთხო შენახვა</li>
          <li>დოკუმენტების მარტივად გაზიარება</li>
          <li>დოკუმენტების ძიება და ფილტრაცია</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">ჩვენი ღირებულებები</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>უსაფრთხოება და კონფიდენციალურობა</li>
          <li>მომხმარებლის მოხერხებულობა</li>
          <li>ინოვაცია და უწყვეტი გაუმჯობესება</li>
          <li>მომხმარებლის მხარდაჭერა</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">კონტაქტი</h2>
        <p className="mb-4">
          თუ გაქვთ კითხვები ან წინადადებები, გთხოვთ დაგვიკავშირდეთ:
        </p>
        <ul className="list-disc pl-6">
          <li>ელ-ფოსტა: info@sabap.ge</li>
          <li>ტელეფონი: +995 32 123 4567</li>
          <li>მისამართი: თბილისი, საქართველო</li>
        </ul>
      </div>
    </div>
  );
} 