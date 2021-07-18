Imports Microsoft.VisualBasic
Imports Microsoft.ApplicationBlocks.Data
Imports System.Data.SqlClient
Imports System.Data

Public Class DAL
    Dim cn As SqlConnection
    Dim Context As HttpContext = HttpContext.Current
    Public Sub New()
        cn = New SqlConnection(ConnectionString.ConnectionString)

    End Sub

    Public Function form_action(ByVal json_string As String, ByVal action_type As String) As DataSet
        Try
            Dim params() As SqlParameter = {
                                            New SqlParameter("@JSON_STRING", json_string),
                                            New SqlParameter("@ACTION_TYPE", action_type)
                                            }
            Return SqlHelper.ExecuteDataset(cn, CommandType.StoredProcedure, "FORM_ACTION", params)
        Catch ex As Exception
            BLL.writeLog(ex.Message + " : " + ex.StackTrace)
            Return Nothing
        Finally
            cn.Close()
        End Try
    End Function

End Class
