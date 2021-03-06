import React from 'react'
import { mount, shallow } from 'enzyme'
import { UsersList } from '../../containers/UsersList'
import usersFixture from '../../fixtures/users'
import { StaticRouter } from 'react-router'

describe('UsersList', () => {
  let wrapper
  const context = {}
  wrapper = mount(
    <StaticRouter context={context}>
      <UsersList
        users={usersFixture}
        fetchUsers={() =>
          new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve('promise')
            }, 300)
          })
        }
        setLastLocation={() => {}}
      />
    </StaticRouter>
  )

  it('should have a header Volunteers Directory', () => {
    expect(wrapper.find('Header').text()).toBe('Volunteers Directory')
  })

  it('should have a Paginate component', () => {
    expect(wrapper.find('Paginate')).toHaveLength(1)
  })

  it('should have a PaginationLinks component', () => {
    expect(wrapper.find('PaginationLinks')).toHaveLength(1)
  })

  it('should call handlePageSelect when a pagination link is clicked', () => {
    let paginationLink2 = wrapper.find('span').filterWhere(item => {
      return item.text() === '2'
    })
    paginationLink2.simulate('click')
    let usersList = wrapper.find('UsersList')
    expect(usersList.instance().state.selectedPage).toEqual(2)
    expect(usersList.instance().state.lastPage).toBe(false)
    expect(usersList.instance().state.firstPage).toBe(false)
  })

  it('should set lastPage to true when the selectedPage is the last', () => {
    let paginationLink2 = wrapper.find('span').filterWhere(item => {
      return item.text() === '3'
    })
    paginationLink2.simulate('click')
    let usersList = wrapper.find('UsersList')
    expect(usersList.instance().state.lastPage).toBe(true)
  })

  it('should set firstPage to true when the selectedPage is the first', () => {
    let paginationLink2 = wrapper.find('span').filterWhere(item => {
      return item.text() === '1'
    })
    paginationLink2.simulate('click')
    let usersList = wrapper.find('UsersList')
    expect(usersList.instance().state.firstPage).toBe(true)
  })

  it("shouldn't render a Project component without users", () => {
    const wrapper = mount(
      <StaticRouter context={context}>
        <UsersList users={[]} fetchUsers={() => {}} setLastLocation={() => {}} />
      </StaticRouter>
    )
    expect(wrapper.find('User')).toHaveLength(0)
  })

  it('should test componentWillReceiveProps', () => {
    const wrapper = shallow(<UsersList users={[]} fetchUsers={() => {}} setLastLocation={() => {}} />)
    wrapper.setProps({ users: ['something'] })
    expect(wrapper.instance().state.users).toEqual({ '1': ['something'] })
  })

  it('should test componentWillReceiveProps', () => {
    const wrapper = shallow(<UsersList users={usersFixture} fetchUsers={() => {}} setLastLocation={() => {}} />)
    wrapper.setProps(usersFixture)
    expect(wrapper.instance().state.users[1][0]).toEqual(usersFixture[0])
  })
})
