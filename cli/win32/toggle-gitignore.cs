using System;
using System.IO;
using System.Windows.Forms;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace ToggleGitignore {
    public class App {
        [STAThread]
        static void Main(string[] sources) {

            foreach (string source in sources) {
                bool isDir = string.IsNullOrEmpty(Path.GetFileName(source)) || Directory.Exists(source);
                string dir = isDir ? source : (new FileInfo(source)).DirectoryName;

                Process cmd = new Process();
                cmd.StartInfo.FileName = "cmd.exe";
                cmd.StartInfo.RedirectStandardInput = true;
                cmd.StartInfo.RedirectStandardOutput = true;
                cmd.StartInfo.CreateNoWindow = true;
                cmd.StartInfo.UseShellExecute = false;
                cmd.Start();

                cmd.StandardInput.WriteLine("cd "+dir);
                cmd.StandardInput.WriteLine("git rev-parse --show-toplevel");
                cmd.StandardInput.Flush();
                cmd.StandardInput.Close();
                cmd.WaitForExit();

                string output = cmd.StandardOutput.ReadToEnd();
                string[] cmdLines = output.Split('\n');

                string topLevel = cmdLines[6];
                DirectoryInfo topLevelInfo = new DirectoryInfo(topLevel);

                string gitignore = Path.Combine(topLevel, ".gitignore");

                string newLine = Regex.Replace(source.Replace("\\", "/"), "^"+topLevel+"[\\\\|\\/]", "");

                string temp = "C:/temp/.gitignore";
                using (var streamWriter = new StreamWriter(temp))
                using (var streamReader = new StreamReader(gitignore)) {
                    string currentLine;

                    StringCollection lines = new StringCollection();
                    while ((currentLine = streamReader.ReadLine()) != null)
                        lines.Add(currentLine);

                    bool insert = !lines.Contains(newLine);
                    foreach(string line in lines)
                        if (line != newLine) streamWriter.WriteLine(line);
                    if (insert) streamWriter.WriteLine(newLine);
                }

                File.Copy(temp, gitignore, true);
                if (File.Exists(temp)) File.Delete(temp);

            }

        }
    }
}
