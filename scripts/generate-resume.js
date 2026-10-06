import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'node:fs';
import path from 'node:path';

async function createResume() {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Page 1
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page1.getSize();
  const margin = 40;
  const contentWidth = width - margin * 2;

  let y = height - 40;

  // Header
  page1.drawText('MAINUDDIN TALUKDAR', {
    x: width / 2 - fontBold.widthOfTextAtSize('MAINUDDIN TALUKDAR', 18) / 2,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.08, 0.12, 0.18),
  });
  y -= 16;

  const subTitle = 'Software Engineer | Python · Java · Spring Boot · React | AI Agents · LLMs · RAG · MCP · AWS';
  page1.drawText(subTitle, {
    x: width / 2 - fontBold.widthOfTextAtSize(subTitle, 9.5) / 2,
    y,
    size: 9.5,
    font: fontBold,
    color: rgb(0.12, 0.22, 0.35),
  });
  y -= 14;

  const contactLine = 'Upper Riccarton, Christchurch  •  022 121 8409  •  mainuddin.talukdar.global@gmail.com';
  page1.drawText(contactLine, {
    x: width / 2 - fontRegular.widthOfTextAtSize(contactLine, 8.5) / 2,
    y,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.25, 0.3, 0.35),
  });
  y -= 12;

  const linksLine = 'mainuddintalukdar.cloud  •  linkedin.com/in/mainuddintalukdar  •  github.com/qmainuddin';
  page1.drawText(linksLine, {
    x: width / 2 - fontRegular.widthOfTextAtSize(linksLine, 8.5) / 2,
    y,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.2, 0.4, 0.6),
  });
  y -= 12;

  const visaLine = 'Student visa: up to 25 hours a week during semester and full time over summer break (Nov to Feb) | Based in Christchurch on NZ time';
  page1.drawText(visaLine, {
    x: width / 2 - fontOblique.widthOfTextAtSize(visaLine, 7.8) / 2,
    y,
    size: 7.8,
    font: fontOblique,
    color: rgb(0.35, 0.4, 0.45),
  });
  y -= 16;

  function drawSectionHeader(page, title, currentY) {
    page.drawText(title, {
      x: margin,
      y: currentY,
      size: 10,
      font: fontBold,
      color: rgb(0.08, 0.15, 0.25),
    });
    page.drawLine({
      start: { x: margin, y: currentY - 3 },
      end: { x: width - margin, y: currentY - 3 },
      thickness: 0.8,
      color: rgb(0.7, 0.75, 0.8),
    });
    return currentY - 14;
  }

  function drawParagraph(page, text, currentY, size = 8.2, lineHeight = 10.5) {
    const words = text.split(' ');
    let line = '';
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, size);
      if (testWidth > contentWidth) {
        page.drawText(line, { x: margin, y: currentY, size, font: fontRegular, color: rgb(0.15, 0.18, 0.22) });
        currentY -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x: margin, y: currentY, size, font: fontRegular, color: rgb(0.15, 0.18, 0.22) });
      currentY -= lineHeight;
    }
    return currentY;
  }

  function drawBullet(page, text, currentY, size = 8.2, lineHeight = 10.5) {
    const bulletIndent = 10;
    const bulletWidth = contentWidth - bulletIndent;
    page.drawText('•', { x: margin, y: currentY, size, font: fontBold, color: rgb(0.2, 0.3, 0.4) });

    const words = text.split(' ');
    let line = '';
    let isFirst = true;
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, size);
      if (testWidth > bulletWidth) {
        page.drawText(line, { x: margin + bulletIndent, y: currentY, size, font: fontRegular, color: rgb(0.15, 0.18, 0.22) });
        currentY -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x: margin + bulletIndent, y: currentY, size, font: fontRegular, color: rgb(0.15, 0.18, 0.22) });
      currentY -= lineHeight;
    }
    return currentY - 2;
  }

  // Section 1: Profile
  y = drawSectionHeader(page1, 'PROFILE', y);
  y = drawParagraph(
    page1,
    'Full-stack software engineer with nearly nine years of commercial experience, most of it building Java and Spring Boot services behind React front ends for banking, payments and national government systems. My work has centred on the things that decide whether a product survives real customers: latency, reliability, clean data pipelines, test coverage and dependable CI/CD. I am now studying towards a Master of Artificial Intelligence at the University of Canterbury and building LLM applications with RAG, tool calling and MCP, and want to bring both together to take an AI product from pilot to production.',
    y
  );
  y -= 6;

  // Section 2: Key Skills
  y = drawSectionHeader(page1, 'KEY SKILLS', y);
  const skills = [
    { label: 'Languages & Backend: ', text: 'Python, Java 8 to 21, TypeScript, SQL, Bash; Spring Boot, Spring Cloud, Spring Security, Spring Data JPA, Spring Batch, Hibernate; REST, GraphQL and SOAP APIs, microservices, system integration, Kafka, RabbitMQ; OOP and SOLID.' },
    { label: 'Front End: ', text: 'React, Next.js, Node.js and React Native; turning APIs into clear, responsive interfaces.' },
    { label: 'AI & LLM Engineering: ', text: 'AI agents and agentic workflows in Python; LLM integrations and tool calling; building MCP servers and tools; retrieval-augmented generation (RAG) with embeddings and vector search; LangChain; prompt engineering and evaluation; deep learning in TensorFlow and Keras; AI coding agents (Claude Code, Cursor, Codex).' },
    { label: 'Cloud & DevOps: ', text: 'AWS (EC2, Lambda, S3, RDS, SQS, SNS, API Gateway, CloudWatch), Docker, Kubernetes, Linux; CI/CD with GitHub Actions and Jenkins; Git and code review; observability with Prometheus, Grafana and Splunk.' },
    { label: 'Data: ', text: 'PostgreSQL, Oracle, SQL Server, Redis, DynamoDB, Supabase; schema design, indexing and query tuning; ETL and real-time streaming with Spark, SparkSQL, Hadoop and Kafka; Liquibase and Flyway migrations.' },
    { label: 'Security & Quality: ', text: 'Secure design for banking and government systems; Spring Security, JWT and SAML auth, role-based access control, Resilience4j rate limiting, secrets management; JUnit, Mockito, Cucumber, smoke tests.' },
  ];

  for (const sk of skills) {
    const fullText = sk.label + sk.text;
    const words = fullText.split(' ');
    let line = '';
    let isStart = true;
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      if (fontRegular.widthOfTextAtSize(testLine, 8.0) > contentWidth) {
        if (isStart) {
          page1.drawText(sk.label, { x: margin, y, size: 8.0, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
          const labelW = fontBold.widthOfTextAtSize(sk.label, 8.0);
          const remainder = line.substring(sk.label.length);
          page1.drawText(remainder, { x: margin + labelW, y, size: 8.0, font: fontRegular, color: rgb(0.18, 0.22, 0.26) });
          isStart = false;
        } else {
          page1.drawText(line, { x: margin, y, size: 8.0, font: fontRegular, color: rgb(0.18, 0.22, 0.26) });
        }
        y -= 10;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      if (isStart) {
        page1.drawText(sk.label, { x: margin, y, size: 8.0, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
        const labelW = fontBold.widthOfTextAtSize(sk.label, 8.0);
        const remainder = line.substring(sk.label.length);
        page1.drawText(remainder, { x: margin + labelW, y, size: 8.0, font: fontRegular, color: rgb(0.18, 0.22, 0.26) });
      } else {
        page1.drawText(line, { x: margin, y, size: 8.0, font: fontRegular, color: rgb(0.18, 0.22, 0.26) });
      }
      y -= 10;
    }
    y -= 1.5;
  }
  y -= 4;

  // Section 3: Professional Experience (Page 1)
  y = drawSectionHeader(page1, 'PROFESSIONAL EXPERIENCE', y);

  // Job 1
  page1.drawText('Software Development Engineer II, Aperia Solutions (client: Fiserv)', { x: margin, y, size: 8.8, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
  y -= 10;
  page1.drawText('New Jersey, USA  •  Aug 2024 – Feb 2026', { x: margin, y, size: 7.8, font: fontOblique, color: rgb(0.35, 0.4, 0.45) });
  y -= 11;
  y = drawBullet(page1, 'Owned payment and financial-reporting services in Java and Spring Boot from requirements and design through build, testing, deployment and support, working closely with client stakeholders.', y);
  y = drawBullet(page1, 'Improved API response time by around 40% under peak load, and added Redis caching that cut average read latency by more than 80% for real-time balance updates.', y);
  y = drawBullet(page1, 'Tuned JPA and Hibernate for around 60% faster database access, and rewrote heavy Oracle queries so reports ran in seconds rather than minutes.', y);
  y = drawBullet(page1, 'Led the upgrade from Java 11 to 21 and Spring Boot 2 to 3, and helped move critical payment modules to cloud-native microservices on AWS, delivered through Docker and Jenkins with Prometheus and Grafana monitoring.', y);
  y = drawBullet(page1, 'From 2025, brought AI coding agents into day-to-day development for code generation, refactoring, test writing and review, which gave me a practical view of where LLMs help and where they need guard rails.', y);
  y -= 4;

  // Job 2 (Start on page 1)
  page1.drawText('Software Developer, promoted to Senior Software Developer, Vantage Labs', { x: margin, y, size: 8.8, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
  y -= 10;
  page1.drawText('Pennsylvania, USA (remote)  •  Jun 2019 – Aug 2023', { x: margin, y, size: 7.8, font: fontOblique, color: rgb(0.35, 0.4, 0.45) });
  y -= 11;
  y = drawBullet(page1, 'Built and supported FormReleaf, a Spring Boot, React and AWS registration platform used by more than 1,000 US schools, including Stripe and PayPal payments for around 10,000 users a day and a React Native app that grew the user base by 11%.', y);
  y = drawBullet(page1, 'Led the migration of a legacy front end to React and rebuilt DigitalSports on Spring Boot and React.', y);

  // ===================== PAGE 2 =====================
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  let y2 = height - 40;

  // Job 2 continued bullets
  y2 = drawBullet(page2, 'Led Python data pipelines on Hadoop and Spark over large volumes of athlete performance data, powering the recommendations behind a partner programme with NCSA that lifted revenue by 9.7% a year.', y2);
  y2 = drawBullet(page2, 'Designed PostgreSQL schemas and indexing for high-volume workloads, cut API response time by around 30% through persistence-layer tuning, and reduced a bulk notification job from hours to seconds.', y2);
  y2 = drawBullet(page2, 'Diagnosed production issues with thread dumps, GC tuning and memory profiling, and moved the platform to AWS with performance monitoring.', y2);
  y2 -= 5;

  // Job 3
  page2.drawText('Software Developer, TigerIT Bangladesh Ltd', { x: margin, y: y2, size: 8.8, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
  y2 -= 10;
  page2.drawText('Dhaka, Bangladesh  •  Jun 2016 – Jun 2019', { x: margin, y: y2, size: 7.8, font: fontOblique, color: rgb(0.35, 0.4, 0.45) });
  y2 -= 11;
  y2 = drawBullet(page2, 'Delivered national identity and driving-licence systems serving more than 100 million people, using Java, Spring Boot, EJB, Oracle and WebLogic, and reduced licence processing time by around 30%.', y2);
  y2 = drawBullet(page2, 'Built reporting pipelines with SparkSQL, Spark Streaming and Kafka that gave near real-time insight across 35 TB of operational data.', y2);
  y2 = drawBullet(page2, 'Built a Spring Boot traffic violation system for the traffic police, with Resilience4j rate limiting to keep critical services stable under load spikes.', y2);
  y2 -= 6;

  // Volunteering
  y2 = drawSectionHeader(page2, 'VOLUNTEERING', y2);
  page2.drawText('Volunteer Mobile Application Developer, Instrumental Difference', { x: margin, y: y2, size: 8.8, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
  y2 -= 10;
  page2.drawText('New Zealand  •  Current', { x: margin, y: y2, size: 7.8, font: fontOblique, color: rgb(0.35, 0.4, 0.45) });
  y2 -= 11;
  y2 = drawBullet(page2, 'Developing a music learning platform: a React Native and TypeScript app in which teachers prepare lessons and students join live online classes, starting with violin and designed so further instruments can be added.', y2);
  y2 -= 6;

  // AI Projects & Research
  y2 = drawSectionHeader(page2, 'AI PROJECTS & RESEARCH', y2);
  y2 = drawBullet(page2, 'TradiePulse: A conversational AI agent that turns a homeowner\'s plain-language description of a problem into a match with the nearest suitably qualified tradesperson, using agentic tool calling and retrieval (RAG). I built the Python agent service, the Next.js front end and the Supabase (PostgreSQL) data layer.', y2);
  y2 = drawBullet(page2, 'MathQuest: A maths learning app for primary-school children, with a separate Python service that scores each child\'s progress and suggests what to practise next. Both apps run in Docker and deploy through GitHub Actions, where unit and smoke tests must pass first.', y2);
  y2 = drawBullet(page2, 'IEEE publication: "A Stacked Meta-Model Framework for Diabetes Prediction: From Effective Feature Engineering to Meta-Learning", presented at ICCIT (ieeexplore.ieee.org/document/11022382).', y2);
  y2 -= 6;

  // Education
  y2 = drawSectionHeader(page2, 'EDUCATION', y2);
  page2.drawText('Master of Artificial Intelligence', { x: margin, y: y2, size: 8.8, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
  y2 -= 10;
  page2.drawText('University of Canterbury, Christchurch  •  current, expected mid-2027', { x: margin, y: y2, size: 7.8, font: fontOblique, color: rgb(0.35, 0.4, 0.45) });
  y2 -= 10;
  page2.drawText('Coursework includes COSC440 Deep Learning, building and training neural networks in TensorFlow and Keras.', { x: margin, y: y2, size: 8.0, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
  y2 -= 13;

  page2.drawText('Master of Science in Computer Science', { x: margin, y: y2, size: 8.8, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
  y2 -= 10;
  page2.drawText('Maharishi International University, Iowa, USA  •  2025', { x: margin, y: y2, size: 7.8, font: fontOblique, color: rgb(0.35, 0.4, 0.45) });
  y2 -= 13;

  page2.drawText('Bachelor of Science in Software Engineering', { x: margin, y: y2, size: 8.8, font: fontBold, color: rgb(0.1, 0.15, 0.22) });
  y2 -= 10;
  page2.drawText('University of Dhaka, Bangladesh  •  2016', { x: margin, y: y2, size: 7.8, font: fontOblique, color: rgb(0.35, 0.4, 0.45) });
  y2 -= 10;
  page2.drawText('Won DhakaThon 2015, a national two-day hackathon, placing first among more than 100 teams.', { x: margin, y: y2, size: 8.0, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
  y2 -= 15;

  // Interests
  y2 = drawSectionHeader(page2, 'INTERESTS', y2);
  y2 = drawParagraph(page2, 'Playing cricket and table tennis and following football • Walking, hiking and travelling; exploring new places and cultures • Meeting new people, learning from their perspectives and building lasting working relationships.', y2);
  y2 -= 6;

  // Referees
  y2 = drawSectionHeader(page2, 'REFEREES', y2);
  const refs = [
    'Dr Mrudula Mukadam, Chair & Assoc. Prof of Computer Science, Maharishi International University • mmukadam@miu.edu • +1 641 233 5491',
    'Shaikh Ahasanul Haque, Software Development Lead (supervisor), Vantage Labs • shaque@vantage.com • +880 1819 484992',
    'Jamie Humphries, Owner, Instrumental Difference (volunteer project) • jamiehumphries2000@yahoo.com.au • 021 0243 1198',
  ];
  for (const ref of refs) {
    y2 = drawBullet(page2, ref, y2, 7.8, 9.5);
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.resolve('public/assets/Mainuddin_Talukdar_Resume.pdf'), pdfBytes);
  fs.writeFileSync(path.resolve('public/assets/resume-sample.pdf'), pdfBytes);
  console.log('Successfully generated latest 2-page resume PDF! Size:', pdfBytes.length, 'bytes');
}

createResume().catch(console.error);
