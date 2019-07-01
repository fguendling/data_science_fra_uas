# data_science_fra_uas

Das ist unser Repository für das Data Science Projekt. Das Projekt wurde von Mitte April bis Anfang Juli 2019 für ein Modul an der FRA UAS erstellt.

Wichtig:

Es handelt sich um ein Maven Projekt, da das NLP und der Crawler am einfachsten auf diese Weise ins Projekt eingebunden werden konnten.

Es muss ein Build erstellt werden. Dazu ist in Eclipse Maven Build -> clean verify und eventuell Maven install auszuführen. Danach kann die App in einem Tomcat 9 ausgeführt werden. Den Stanford NLP Teil kann man eigentlich komplett aus dem Projekt entfernen, dann erfolgt der Build auch schneller.

Zu beachten ist, dass die für das Projekt verwendete Datenbank augeschaltet wurde. Ein Dump der Datenbank befindet sich im Queries Verzeichnis. Dieser Dump kann in eine beliebige MySQL/ MariaDB Datenbank integriert werden. Die Datenbankverbindung muss dann im (Java) Code angepasst werden.

Die Grundlegende Pipeline der App kann folgendermaßen beschrieben werden:

- Aufruf der Webseite
- Eingabe der URL einer Indeed-Suche sowie manuelle Eingabe von Job und Ort
- Nach Klick auf Submit wird zunächst der Crawler aktiviert, der alle Stellenausschreibungen sowie weitere Informationen in eine Datenbank schreibt.
- Im Anschluss startet das NLP (Apache OpenNLP) und erzeugt Tokens sowie Part-Of-Speech Tags
- Nun können die Daten ausgewertet werden. es ist zu betonen, dass die Charts auf der Webseite sich nicht automatisch aktualisieren, da statische JSON Files verwendet werden, um die Charts möglichst schnell zu  laden. Man könnte natürlich auch die Charts basierend auf Datenbankabfragen generieren, dann hätte man jederzeit dynamische Charts mit aktuellen Daten. 





