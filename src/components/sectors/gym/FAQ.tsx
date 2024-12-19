import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Deneme süreci nasıl işliyor?",
    answer: "14 günlük ücretsiz deneme sürecinde sistemimizin tüm özelliklerine erişim sağlayabilirsiniz. Kredi kartı bilgisi gerektirmeyen bu süreçte, herhangi bir otomatik ücretlendirme yapılmaz."
  },
  {
    question: "İnternet kesintilerinde sistem nasıl çalışıyor?",
    answer: "Offline kullanım özelliğimiz sayesinde, internet bağlantınız olmadığında bile müzik akışı kesintisiz devam eder. Playlist'lerinizi önceden indirerek her koşulda kesintisiz hizmet alabilirsiniz."
  },
  {
    question: "Telif hakları konusunda endişelenmeli miyim?",
    answer: "Tüm müzik içeriğimiz, ticari kullanım için gerekli lisanslara sahiptir. Sistemimizi kullanırken telif hakkı sorunu yaşama riskiniz bulunmamaktadır."
  },
  {
    question: "Müzik içeriğini özelleştirebiliyor muyum?",
    answer: "Evet, kendi playlist'lerinizi oluşturabilir, mevcut içerikleri düzenleyebilir ve spor salonunuzun konseptine göre özelleştirebilirsiniz. Ayrıca uzman ekibimiz size özel playlist'ler hazırlayabilir."
  }
];

export function FAQ() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in-up">
        Sıkça Sorulan Sorular
      </h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`} 
            className="border rounded-lg px-6 animate-fade-in-up bg-white shadow-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="text-lg font-semibold">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}