import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Deneme süresi nasıl işliyor?",
    answer: "14 günlük ücretsiz deneme süresinde tüm özelliklere erişebilirsiniz. Kredi kartı bilgisi gerektirmez ve süre sonunda otomatik ücretlendirme yapılmaz."
  },
  {
    question: "Müzikleri offline kullanabilir miyim?",
    answer: "Evet, playlist'lerinizi offline kullanım için indirebilirsiniz. İnternet bağlantınız olmadığında bile müzik kesintisiz devam eder."
  },
  {
    question: "Telif hakkı sorunu yaşar mıyım?",
    answer: "Hayır, tüm müziklerimiz telif hakkı ödenmiş ve ticari kullanıma uygun lisanslara sahiptir."
  },
  {
    question: "Playlist'leri özelleştirebilir miyim?",
    answer: "Evet, kendi playlist'lerinizi oluşturabilir, mevcut playlist'leri düzenleyebilir ve antrenman programınıza göre özelleştirebilirsiniz."
  }
];

export function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-up">
        Sıkça Sorulan Sorular
      </h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`} 
            className="border rounded-lg px-6 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="text-lg font-medium">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}