import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link } from '@react-pdf/renderer';

// Register Fonts for consistent look in PDF
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
  ],
});

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: { fontFamily: 'Roboto', padding: 40, fontSize: 10, color: '#2d2d2d' },
  header: { textAlign: 'center', marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 },
  name: { fontSize: 28, fontWeight: 'bold' },
  title: { fontSize: 14, color: '#4a4a4a', marginTop: 4 },
  contact: { flexDirection: 'row', justifyContent: 'center', marginTop: 5, fontSize: 9, color: '#555' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase' },
  text: { lineHeight: 1.5 },
  listItem: { marginBottom: 10 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  itemTitle: { fontSize: 11, fontWeight: 'bold' },
  itemSub: { fontSize: 10, color: '#4a4a4a' },
  itemDate: { fontSize: 9, fontStyle: 'italic', color: '#666' },
  link: { color: 'blue', textDecoration: 'none' },
});

// Create Document Component (FIXED with defensive checks)
const ResumeDocument = ({ resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{resume?.contact?.name ?? 'Your Name'}</Text>
        <Text style={styles.title}>{resume?.contact?.title ?? 'Your Title'}</Text>
        <View style={styles.contact}>
            <Text>{resume?.contact?.email ?? ''}</Text>
            {resume?.contact?.phone && <Text> | {resume.contact.phone}</Text>}
            {resume?.contact?.linkedin && <><Text> | </Text><Link style={styles.link} src={resume.contact.linkedin}>LinkedIn</Link></>}
        </View>
      </View>
      
      {resume?.summary && (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.text}>{resume.summary}</Text>
        </View>
      )}

      {/* FIXED: Check for existence and content before rendering */}
      {(resume?.experience || []).length > 0 && resume.experience[0].jobTitle && (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {(resume.experience || []).map((exp, i) => (
                <View key={i} style={styles.listItem}>
                    <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                        <Text style={styles.itemDate}>{exp.dates}</Text>
                    </View>
                    <Text style={styles.itemSub}>{exp.company}</Text>
                    <Text style={styles.text}>{exp.description}</Text>
                </View>
            ))}
        </View>
      )}

      {(resume?.projects || []).length > 0 && resume.projects[0].name && (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {(resume.projects || []).map((proj, i) => (
                <View key={i} style={styles.listItem}>
                    <Text style={styles.itemTitle}>{proj.name}</Text>
                    {proj.link && <Link style={styles.link} src={proj.link}>{proj.link}</Link>}
                    <Text style={styles.text}>{proj.description}</Text>
                </View>
            ))}
        </View>
      )}
      
      {(resume?.education || []).length > 0 && resume.education[0].degree && (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {(resume.education || []).map((edu, i) => (
                <View key={i} style={styles.listItem}>
                     <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{edu.degree}</Text>
                        <Text style={styles.itemDate}>{edu.year}</Text>
                    </View>
                    <Text style={styles.itemSub}>{edu.institution}</Text>
                </View>
            ))}
        </View>
      )}

      {/* FIXED: Handle skills as either an array OR a string to prevent crashes */}
      {resume?.skills && (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.text}>
                {Array.isArray(resume.skills) ? resume.skills.join(', ') : resume.skills}
            </Text>
        </View>
      )}
    </Page>
  </Document>
);

export default ResumeDocument;