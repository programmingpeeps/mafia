defmodule HelloWeb.RoomChannel do
  use Phoenix.Channel
  require Logger

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end
  def join("room:" <> username, _params, socket) do
    if socket.assigns.username == username do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("dm_msg", %{"to" => user, "message" => message}, socket) do
    HelloWeb.Endpoint.broadcast "room:#{user}", "dm_msg", %{message: message, user: socket.assigns.username}
    {:noreply, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast! socket, "new_msg",
      %{message: body, user: socket.assigns.username}
    {:noreply, socket}
  end
end
