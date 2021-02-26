defmodule BullsWeb.GameChannel do
  use BullsWeb, :channel

  # Credit to Nat Tuck's 07 Lecture notes
  #https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/07-phoenix/notes.md
  @impl true
  def join("game:" <> game_name, payload, socket) do
    if authorized?(payload) do
      Bulls.GameServer.start(game_name)
      socket = socket
      |> assign(:name, game_name)
      |> assign(:user, "")

      game = Bulls.GameServer.peek(game_name)
      view = Bulls.Game.view(game, "")
      #socket = assign(socket, :game, game)
      {:ok, view, socket}
      end
  end

  @impl true
  def handle_in("guess", %{"numbers" => ll}, socket) do
    user = socket.assigns[:user]
    view = socket.assigns[:name]
    |> Bulls.GameServer.make_guess(ll)
    |> Bulls.Game.view(user)
    broadcast(socket,"view",view)

    #game0 = socket.assigns[:game]
    #game1 = Bulls.Game.make_guess(game0, ll)
    #socket = assign(socket, :game, game1)
    #view = Bulls.Game.view(game1)
    #broadcast(socket,"view",view)
    {:reply, {:ok, view}, socket}
  end

   @impl true
  def handle_in("reset", _, socket) do
    user = socket.assigns[:user]
    view = socket.assigns[:name]
    |> Bulls.GameServer.reset()
    |> Bulls.Game.view(user)
    broadcast(socket,"view",view)

    #game = Bulls.Game.new
    #socket = assign(socket, :game, game)
    #view = Bulls.Game.view(game)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("login", %{"game_name" => game_name, "user_name" => user_name}, socket) do
    socket = assign(socket, :user, user_name)
    view = socket.assigns[:name]
    |> Bulls.GameServer.peek()
    |> Bulls.Game.view(user_name)
    {:reply, {:ok, view}, socket}
  end

  intercept ["view"]

  @impl true
  def handle_out("view",msg,socket) do
    user = socket.assigns[:user]
    msg = %{msg | name: user}
    push(socket, "view", msg)
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
