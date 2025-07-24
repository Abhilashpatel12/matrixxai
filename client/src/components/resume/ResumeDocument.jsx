import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link } from '@react-pdf/renderer';

// Register Fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: { fontFamily: 'Roboto', padding: 40, fontSize: 10, color: '#2d2d2d' },
  header: { textAlign: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  name: { fontSize: 24, fontWeight: 'bold' },
  title: { fontSize: 12, color: '#4a4a4a', marginTop: 4 },
  contact: { flexDirection: 'row', justifyContent: 'center', marginTop: 6, fontSize: 9, color: '#555' },

  section: { marginTop: 10, marginBottom: 10 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#333',
    paddingBottom: 3,
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  text: { lineHeight: 1.4, marginBottom: 3 },
  listItem: { marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  itemTitle: { fontSize: 10, fontWeight: 'bold' },
  itemSub: { fontSize: 9, color: '#4a4a4a' },
  itemDate: { fontSize: 8, fontStyle: 'italic', color: '#666' },
  link: { color: 'blue', textDecoration: 'none' },
});

const ResumeDocument = ({ resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{resume?.contact?.name ?? 'Your Name'}</Text>
        <Text style={styles.title}>{resume?.contact?.title ?? 'Your Title'}</Text>
        <View style={styles.contact}>
          <Text>{resume?.contact?.email ?? ''}</Text>
          {resume?.contact?.phone && <Text> | {resume.contact.phone}</Text>}
          {resume?.contact?.linkedin && (
            <>
              <Text> | </Text>
              <Link style={styles.link} src={resume.contact.linkedin}>LinkedIn</Link>
            </>
          )}
        </View>
      </View>

      {resume?.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.text}>{resume.summary}</Text>
        </View>
      )}

      {(resume?.experience || []).length > 0 && resume.experience[0].jobTitle && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {resume.experience.map((exp, i) => (
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
          {resume.projects.map((proj, i) => (
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
          {resume.education.map((edu, i) => (
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
