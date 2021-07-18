Imports Microsoft.VisualBasic
Imports Microsoft.AspNet.SignalR
Imports Newtonsoft.Json
Imports Newtonsoft.Json.Linq
Imports System.Web.Script.Serialization
Imports System.Data
Imports System.IO
Imports System.Data.SqlClient
Imports System.Globalization
Imports System.Drawing

    Public Class Chathub
        Inherits Hub
        Dim DAL As New DAL

        Public Function form_action(ByVal json_string As String, ByVal action_type As String) As String
            Dim status As String = "ERROR"
            Dim dc_return As New Dictionary(Of String, Object)

            Try
                Dim ds As DataSet = DAL.form_action(json_string, action_type)
                Dim dt As DataTable = ds.Tables(0)
                dc_return.Add("RESULT", dt)
                dc_return.Add("ACTION_TYPE", action_type)
                status = "SUCCESS"
            Catch ex As Exception
                BLL.writeLog(ex.Message + " : " + ex.StackTrace)
            End Try

            dc_return.Add("STATUS", status)
            Return JsonConvert.SerializeObject(dc_return)
        End Function

    End Class
