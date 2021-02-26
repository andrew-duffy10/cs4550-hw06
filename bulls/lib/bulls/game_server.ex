# Credit to Nat Tuck's 02-19-2021 lecture
# https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0219/hangman
defmodule Bulls.GameServer do
  use GenServer

  def reg(name) do
    {:via, Registry, {Bulls.GameReg, name}}
  end

  def start(name) do
    spec = %{
    id: __MODULE__,
    start: {__MODULE__, :start_link, [name]},
    restart: :permanent,
    type: :worker
    }
    Bulls.GameSupport.start_child(spec)
  end

  def start_link(name) do
    game = Bulls.BackupAgent.get(name) || Bulls.Game.new()
    GenServer.start_link(
    __MODULE__,
    game,
    name: reg(name))
  end

  def reset(name) do
    GenServer.call(reg(name), {:reset,name})
  end

  def make_guess(name,numbers) do
    GenServer.call(reg(name), {:make_guess, name, numbers})
  end

  def peek(name) do
    GenServer.call(reg(name),{:peek, name})
  end

  def add_player(name,user_name) do
    GenServer.call(reg(name),{:add_player,name,user_name})
  end

  def ready_up(name,user_name) do
    GenServer.call(reg(name),{:ready_up,name,user_name})
  end

  def init(game) do
    Process.send_after(self(), :pook, 10_000)
    {:ok,game}
  end

  def handle_call({:reset, name}, _from, game) do
    game = Bulls.Game.new()
    Bulls.BackupAgent.put(name, game)
    {:reply,game,game}
  end

  def handle_call({:make_guess, name,numbers}, _from, game) do
    game = Bulls.Game.make_guess(game,numbers)
    Bulls.BackupAgent.put(name, game)
    {:reply,game,game}
  end

  def handle_call({:add_player,name,user_name},_from,game) do
    game = Bulls.Game.add_player(game,user_name)
    Bulls.BackupAgent.put(name,game)
    {:reply,game,game}
  end

  def handle_call({:ready_up,name,user_name},_from,game) do
    game = Bulls.Game.ready_up(game,user_name)
    Bulls.BackupAgent.put(name,game)
    {:reply,game,game}
  end

  def handle_call({:peek, name}, _from, game) do
    {:reply,game,game}
  end

  def handle_info(:pook, game) do
    #game = Bulls.Game.make_guess(game, "1234")
    BullsWeb.Endpoint.broadcast!(
    "game:1", #TODO FIX
    "view",
    Bulls.Game.view(game, ""))
    {:noreply, game}
  end

end